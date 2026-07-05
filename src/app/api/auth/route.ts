import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, hashOTP, generateBackupCodes, hashBackupCodes, generateTOTPSecret, deviceFingerprint } from '@/lib/auth-utils'
import { sendWhatsAppOTP } from '@/lib/whatsapp'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function db() {
  const headers = {
    'Content-Type': 'application/json',
    apikey: ANON_KEY || '',
    Authorization: `Bearer ${SERVICE_KEY || ANON_KEY || ''}`,
  }
  return { headers, base: SUPABASE_URL + '/rest/v1' }
}

function apiRes(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

function apiErr(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status })
}

function demoRes(data: any) {
  return NextResponse.json({ data, demo: true })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode } = body

    // ── DEMO MODE ──
    if (!SUPABASE_URL || !ANON_KEY) {
      return handleDemo(body)
    }

    const { headers, base } = db()

    switch (mode) {
      // ── SEND OTP ──
      case 'send_otp': {
        const { phone, purpose } = body
        if (!phone) return apiErr('Teléfono requerido', 400)
        const code = generateOTP(6)

        // store OTP hash
        const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString()
        await fetch(`${base}/otp_codes`, {
          method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify({ phone, code_hash: hashOTP(code), purpose: purpose || 'login', expires_at: expires }),
        })

        await sendWhatsAppOTP(phone, code)
        return apiRes({ message: 'OTP enviado', phone, expires_at: expires })
      }

      // ── VERIFY OTP ──
      case 'verify_otp': {
        const { phone, code, purpose } = body
        if (!phone || !code) return apiErr('Teléfono y código requeridos', 400)

        const otpRes = await fetch(
          `${base}/otp_codes?phone=eq.${encodeURIComponent(phone)}&purpose=eq.${purpose || 'login'}&used=eq.false&order=created_at.desc&limit=1`,
          { headers }
        )
        const otps = await otpRes.json()
        if (!otps || otps.length === 0) return apiErr('Código no encontrado o expirado', 404)

        const record = otps[0]
        if (record.attempts >= 5) return apiErr('Demasiados intentos. Solicita un nuevo código.', 429)
        if (new Date(record.expires_at) < new Date()) return apiErr('Código expirado. Solicita uno nuevo.', 410)
        if (record.code_hash !== hashOTP(code)) {
          await fetch(`${base}/otp_codes?id=eq.${record.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ attempts: record.attempts + 1 }),
          })
          return apiErr('Código incorrecto', 401)
        }

        // mark OTP as used
        await fetch(`${base}/otp_codes?id=eq.${record.id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ used: true }),
        })

        return apiRes({ message: 'OTP verificado', phone })
      }

      // ── REGISTER (after OTP verified) ──
      case 'register': {
        const { phone, displayName, recoveryEmail } = body
        if (!phone) return apiErr('Teléfono requerido', 400)

        // check duplicate
        const existingCheck = await fetch(
          `${base}/verified_phones?phone=eq.${encodeURIComponent(phone)}&select=user_id`,
          { headers }
        )
        const existing = await existingCheck.json()
        if (existing && existing.length > 0) return apiErr('Este número ya está registrado', 409)

        // create user
        const userRes = await fetch(`${base}/users`, {
          method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify({
            display_name: displayName || `Usuario Zafiro`,
            recovery_email: recoveryEmail || null,
            trust_score: 50,
          }),
        })
        if (!userRes.ok) return apiErr('Error al crear usuario', 500)
        const [user] = await userRes.json()

        // link phone
        await fetch(`${base}/verified_phones`, {
          method: 'POST', headers,
          body: JSON.stringify({ user_id: user.id, phone, is_primary: true }),
        })

        // generate backup codes
        const codes = generateBackupCodes()
        const hashed = hashBackupCodes(codes)
        for (const h of hashed) {
          await fetch(`${base}/backup_codes`, {
            method: 'POST', headers,
            body: JSON.stringify({ user_id: user.id, code_hash: h }),
          })
        }

        return apiRes({ user, backup_codes: codes })
      }

      // ── LOGIN (after OTP verified) ──
      case 'login': {
        const { phone } = body
        if (!phone) return apiErr('Teléfono requerido', 400)

        const vpRes = await fetch(
          `${base}/verified_phones?phone=eq.${encodeURIComponent(phone)}&select=user_id`,
          { headers }
        )
        const vps = await vpRes.json()
        if (!vps || vps.length === 0) return apiErr('Número no registrado', 404)

        const userRes = await fetch(`${base}/users?id=eq.${vps[0].user_id}&select=*`, { headers })
        const users = await userRes.json()
        if (!users || users.length === 0) return apiErr('Usuario no encontrado', 404)

        const user = users[0]
        // boost trust on login
        const newScore = Math.min(100, (user.trust_score || 50) + 1)
        await fetch(`${base}/users?id=eq.${user.id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ trust_score: newScore }),
        })

        return apiRes({ user: { ...user, trust_score: newScore } })
      }

      // ── SETUP 2FA ──
      case 'setup_2fa': {
        const { userId } = body
        if (!userId) return apiErr('userId requerido', 400)
        const secret = generateTOTPSecret()

        await fetch(`${base}/users?id=eq.${userId}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ totp_secret: secret, totp_enabled: true }),
        })

        return apiRes({ secret, url: `otpauth://totp/MSM%20Zafiro:user_${userId}?secret=${secret}&issuer=MSM%20Zafiro` })
      }

      // ── VERIFY 2FA TOTP ──
      case 'verify_2fa': {
        const { userId, token } = body
        if (!userId || !token) return apiErr('userId y token requeridos', 400)

        const userRes = await fetch(`${base}/users?id=eq.${userId}&select=totp_secret`, { headers })
        const users = await userRes.json()
        if (!users || !users[0]?.totp_secret) return apiErr('2FA no activado', 400)

        // simple TOTP verification for demo; real uses otplib
        const { createHmac } = await import('crypto')
        const epoch = Math.floor(Date.now() / 30000)
        let ok = false
        for (let offset = -1; offset <= 1; offset++) {
          const counter = Buffer.alloc(8)
          counter.writeBigInt64BE(BigInt(epoch + offset))
          const hmac = createHmac('sha1', users[0].totp_secret).update(counter).digest()
          const offset2 = hmac[hmac.length - 1] & 0xf
          const code = ((hmac[offset2] & 0x7f) << 24 | (hmac[offset2 + 1] & 0xff) << 16 | (hmac[offset2 + 2] & 0xff) << 8 | (hmac[offset2 + 3] & 0xff)) % 1000000
          if (code.toString().padStart(6, '0') === token) { ok = true; break }
        }

        return ok ? apiRes({ verified: true }) : apiErr('Token inválido', 401)
      }

      // ── USE BACKUP CODE ──
      case 'use_backup': {
        const { userId, code } = body
        if (!userId || !code) return apiErr('userId y code requeridos', 400)

        const codesRes = await fetch(
          `${base}/backup_codes?user_id=eq.${userId}&used=eq.false`,
          { headers }
        )
        const codes = await codesRes.json()
        if (!codes || codes.length === 0) return apiErr('No hay códigos de respaldo disponibles', 404)

        const codeHash = hashOTP(code)
        const match = codes.find((c: any) => c.code_hash === codeHash)
        if (!match) return apiErr('Código de respaldo inválido', 401)

        await fetch(`${base}/backup_codes?id=eq.${match.id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ used: true }),
        })

        return apiRes({ message: 'Código de respaldo válido' })
      }

      // ── OAUTH ──
      case 'oauth': {
        const { provider, providerId, email, displayName } = body
        if (!provider || !providerId) return apiErr('Provider y providerId requeridos', 400)

        // check existing
        const existingRes = await fetch(
          `${base}/users?${provider}_id=eq.${providerId}&select=id,display_name,trust_score`,
          { headers }
        )
        const existing = await existingRes.json()
        if (existing && existing.length > 0) {
          const u = existing[0]
          await fetch(`${base}/users?id=eq.${u.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ trust_score: Math.min(100, (u.trust_score || 50) + 1) }),
          })
          return apiRes({ user: { ...u, trust_score: Math.min(100, (u.trust_score || 50) + 1) } })
        }

        const userRes = await fetch(`${base}/users`, {
          method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify({
            [`${provider}_id`]: providerId,
            email: email || null,
            email_verified: true,
            display_name: displayName || `Usuario ${provider}`,
            trust_score: 50,
          }),
        })
        if (!userRes.ok) return apiErr('Error al crear usuario', 500)
        const [user] = await userRes.json()
        return apiRes({ user })
      }

      // ── CHANGE PHONE ──
      case 'change_phone': {
        const { userId, newPhone, otp } = body
        if (!userId || !newPhone || !otp) return apiErr('userId, newPhone y otp requeridos', 400)

        // verify OTP for new phone
        const otpRes = await fetch(
          `${base}/otp_codes?phone=eq.${encodeURIComponent(newPhone)}&purpose=eq.change_phone&used=eq.false&order=created_at.desc&limit=1`,
          { headers }
        )
        const otps = await otpRes.json()
        if (!otps || otps.length === 0 || otps[0].code_hash !== hashOTP(otp)) {
          return apiErr('OTP inválido para el nuevo número', 401)
        }

        // mark old as non-primary, add new
        const vpRes = await fetch(
          `${base}/verified_phones?user_id=eq.${userId}&is_primary=eq.true`,
          { headers }
        )
        const vps = await vpRes.json()
        if (vps && vps.length > 0) {
          await fetch(`${base}/verified_phones?id=eq.${vps[0].id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ is_primary: false }),
          })
        }

        await fetch(`${base}/verified_phones`, {
          method: 'POST', headers,
          body: JSON.stringify({ user_id: userId, phone: newPhone, is_primary: true }),
        })

        await fetch(`${base}/otp_codes?id=eq.${otps[0].id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ used: true }),
        })

        return apiRes({ message: 'Teléfono actualizado' })
      }

      default:
        return apiErr('Modo no soportado', 400)
    }
  } catch (error) {
    console.error('Auth error:', error)
    return apiErr('Error interno del servidor', 500)
  }
}

// ── DEMO MODE HANDLER ──
function handleDemo(body: any) {
  const { mode, phone, code, provider, providerId, newPhone } = body
  const demoUsers = JSON.parse(localStorageGet('zafiro_demo_users') || '{}')

  if (mode === 'send_otp') {
    console.log('[Demo] WhatsApp OTP to', phone, ':', code || 'DEMO123')
    return demoRes({ message: 'OTP enviado', phone, otp: 'DEMO123' })
  }

  if (mode === 'verify_otp') {
    const valid = code === 'DEMO123' || code === '000000'
    if (!valid) return apiErr('Código incorrecto', 401)
    return demoRes({ message: 'OTP verificado', phone })
  }

  if (mode === 'register') {
    if (demoUsers[phone]) return apiErr('Este número ya está registrado', 409)
    const userId = 'demo_' + Math.random().toString(36).slice(2, 10)
    const codes = generateBackupCodes()
    demoUsers[phone] = { userId, displayName: body.displayName || 'Usuario Zafiro', phone, backupCodes: codes }
    localStorageSet('zafiro_demo_users', JSON.stringify(demoUsers))
    return demoRes({ user: { id: userId, display_name: body.displayName || 'Usuario Zafiro' }, backup_codes: codes })
  }

  if (mode === 'login') {
    const user = demoUsers[phone]
    if (!user) return apiErr('Número no registrado', 404)
    return demoRes({ user: { id: user.userId, display_name: user.displayName, trust_score: 51 } })
  }

  if (mode === 'oauth') {
    const key = `${provider}_${providerId}`
    if (demoUsers[key]) return demoRes({ user: { id: demoUsers[key].userId, display_name: demoUsers[key].displayName } })
    const userId = 'demo_' + Math.random().toString(36).slice(2, 10)
    const codes = generateBackupCodes()
    demoUsers[key] = { userId, displayName: body.displayName || `Usuario ${provider}`, backupCodes: codes }
    localStorageSet('zafiro_demo_users', JSON.stringify(demoUsers))
    return demoRes({ user: { id: userId, display_name: body.displayName || `Usuario ${provider}` }, backup_codes: codes })
  }

  if (mode === 'change_phone') {
    if (demoUsers[newPhone]) return apiErr('El nuevo número ya está registrado', 409)
    const user = Object.values(demoUsers as any).find((u: any) => u.userId === body.userId)
    if (!user) return apiErr('Usuario no encontrado', 404)
    delete demoUsers[(user as any).phone]
    ;(user as any).phone = newPhone
    demoUsers[newPhone] = user
    localStorageSet('zafiro_demo_users', JSON.stringify(demoUsers))
    return demoRes({ message: 'Teléfono actualizado' })
  }

  return apiErr('Modo no soportado', 400)
}

function localStorageGet(key: string): string | null {
  if (typeof localStorage === 'undefined') return null
  try { return localStorage.getItem(key) } catch { return null }
}

function localStorageSet(key: string, value: string) {
  if (typeof localStorage === 'undefined') return
  try { localStorage.setItem(key, value) } catch {}
}
