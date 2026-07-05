'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Phone, Loader2, Globe, CheckCircle, MessageCircle, ArrowLeft, Shield, Copy,
  KeyRound, Smartphone, Fingerprint,
} from 'lucide-react'
import { COUNTRY_CODES, detectCarrier, validatePhone } from '@/lib/phone'

type Step =
  | 'phone'       // enter phone number
  | 'otp'          // verify OTP from WhatsApp
  | 'register'     // new user: display name
  | 'setup_2fa'    // ask if they want 2FA
  | 'totp_setup'   // show TOTP secret + verify
  | 'backup_codes' // show backup codes
  | 'done'         // success

const DEMO_OTP = 'DEMO123'

export function AuthForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [countryCode, setCountryCode] = useState('52')
  const [showCountries, setShowCountries] = useState(false)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [userId, setUserId] = useState<string | null>(null)
  const [totpSecret, setTotpSecret] = useState('')
  const [totpURL, setTotpURL] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const carrier = useMemo(() => {
    if (phone.replace(/\D/g, '').length >= 7) return detectCarrier(phone, countryCode)
    return null
  }, [phone, countryCode])

  const isValid = useMemo(() => validatePhone(phone, countryCode), [phone, countryCode])
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode)
  const fullPhone = countryCode + phone.replace(/\D/g, '')

  const api = async (body: any) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) { setError('Número inválido'); return }
    setLoading(true); setError('')

    const res = await api({ mode: 'send_otp', phone: fullPhone, purpose: mode })
    if (res.error) { setError(res.error); setLoading(false); return }
    setStep('otp'); setLoading(false)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) { setError('Código inválido'); return }
    setLoading(true); setError('')

    const res = await api({ mode: 'verify_otp', phone: fullPhone, code, purpose: mode })
    if (res.error) { setError(res.error); setLoading(false); return }

    if (mode === 'register') {
      setStep('register')
    } else {
      // login
      const loginRes = await api({ mode: 'login', phone: fullPhone })
      if (loginRes.error) { setError(loginRes.error); setLoading(false); return }
      setUserId(loginRes.data?.user?.id || loginRes.user?.id)
      if (loginRes.data?.user?.totp_enabled || loginRes.user?.totp_enabled) {
        setStep('totp_setup') // prompt for TOTP
      } else {
        setSession(loginRes.data?.user || loginRes.user)
        setStep('done')
      }
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) { setError('Ingresa tu nombre'); return }
    setLoading(true); setError('')

    const res = await api({ mode: 'register', phone: fullPhone, displayName: displayName.trim(), recoveryEmail: recoveryEmail.trim() || undefined })
    if (res.error) { setError(res.error); setLoading(false); return }

    const user = res.data?.user || res.user
    setUserId(user?.id)
    if (res.data?.backup_codes || res.backup_codes) {
      setBackupCodes(res.data?.backup_codes || res.backup_codes)
    }
    setStep('setup_2fa')
    setLoading(false)
  }

  const handleSkip2FA = () => {
    setSession({ id: userId, display_name: displayName })
    setStep('done')
  }

  const handleSetupTOTP = async () => {
    setLoading(true)
    const res = await api({ mode: 'setup_2fa', userId })
    if (res.error) { setError(res.error); setLoading(false); return }
    setTotpSecret(res.data?.secret || res.secret)
    setTotpURL(res.data?.url || res.url)
    setStep('totp_setup')
    setLoading(false)
  }

  const handleVerifyTOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (totpToken.length < 6) { setError('Token inválido'); return }
    setLoading(true); setError('')

    const res = await api({ mode: 'verify_2fa', userId, token: totpToken })
    if (res.error) { setError(res.error); setLoading(false); return }
    setStep('backup_codes')
    setLoading(false)
  }

  const handleBackupDone = () => {
    setSession({ id: userId, display_name: displayName })
    setStep('done')
  }

  const setSession = (user: any) => {
    localStorage.setItem('zafiro_user', JSON.stringify({
      id: user?.id || userId,
      phone: fullPhone,
      carrier: carrier?.name || 'Desconocido',
      name: user?.display_name || displayName || 'Usuario Zafiro',
    }))
  }

  if (step === 'done') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">¡Bienvenido a Zafiro!</h2>
        <p className="text-sm text-white/50">{carrier?.name ? `${carrier.name} · ` : ''}+{fullPhone}</p>
        <button
          onClick={() => { router.push('/'); router.refresh() }}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Entrar a Zafiro
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-white">
          {mode === 'register' ? 'Regístrate con tu WhatsApp' : 'Inicia sesión'}
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Tu número de teléfono es tu identidad en Zafiro
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
      )}

      {/* STEP: Phone */}
      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Número de teléfono</label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountries(!showCountries)}
                  className="h-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm flex items-center gap-1.5 hover:bg-white/10 transition-colors min-w-[90px]"
                >
                  <span>{selectedCountry?.flag || '🌐'}</span>
                  <span>+{countryCode}</span>
                  <Globe className="w-3 h-3 text-white/40" />
                </button>
                {showCountries && (
                  <div className="absolute top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto bg-[#0f0a1e] border border-white/10 rounded-xl backdrop-blur-2xl z-50 shadow-2xl">
                    {COUNTRY_CODES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setCountryCode(c.code); setShowCountries(false) }}
                        className="w-full px-3 py-2 text-left text-white text-sm hover:bg-white/5 flex items-center gap-2"
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="text-white/40 ml-auto">+{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="55 1234 5678"
                  required
                  autoFocus
                  maxLength={12}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
            {carrier && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>{carrier.name} · {carrier.country}</span>
              </div>
            )}
            {phone.length >= 7 && !carrier && (
              <div className="mt-2 text-xs text-amber-400">Compañía no identificada. Verifica el número.</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
            ) : (
              <><MessageCircle className="w-4 h-4" /> Enviar código por WhatsApp</>
            )}
          </button>

          <p className="text-center text-xs text-white/30">
            Te enviaremos un código por WhatsApp. Al registrarte aceptas nuestros{' '}
            <a href="/terms" className="text-indigo-400 hover:text-indigo-300">Términos</a>.
          </p>

          <div className="text-center pt-2 space-y-2">
            {mode === 'register' ? (
              <button type="button" onClick={() => { setMode('login'); setError('') }}
                className="text-sm text-indigo-400 hover:text-indigo-300 block w-full">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            ) : (
              <button type="button" onClick={() => { setMode('register'); setError('') }}
                className="text-sm text-indigo-400 hover:text-indigo-300 block w-full">
                ¿No tienes cuenta? Regístrate
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP: OTP */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <button type="button" onClick={() => setStep('phone')}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/60">
            <ArrowLeft className="w-3 h-3" /> Cambiar número
          </button>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm text-white/50">
              Enviamos un código a<br />
              <strong className="text-white">+{fullPhone}</strong>
              {carrier && <span className="text-emerald-400"> · {carrier.name}</span>}
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Código de 6 dígitos"
            maxLength={6}
            required
            autoFocus
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors text-center text-2xl tracking-widest"
          />

          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar código'}
          </button>

          <button type="button" onClick={handleSendOTP}
            className="w-full text-center text-sm text-white/40 hover:text-white/60">
            Reenviar código
          </button>
        </form>
      )}

      {/* STEP: Register (display name) */}
      {step === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm text-emerald-400 font-medium">+{fullPhone} ✓ Verificado</p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Tu nombre en Zafiro</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ej: Carlos López"
              required
              autoFocus
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email de respaldo (opcional)</label>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
            <p className="text-xs text-white/30 mt-1">Necesario para recuperar tu cuenta si pierdes el acceso a tu WhatsApp.</p>
          </div>

          <button
            type="submit"
            disabled={loading || !displayName.trim()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</> : 'Crear cuenta'}
          </button>
        </form>
      )}

      {/* STEP: Setup 2FA (ask) */}
      {step === 'setup_2fa' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Protege tu cuenta</h3>
            <p className="text-sm text-white/50 mt-1">Activa la autenticación de dos factores para mayor seguridad.</p>
          </div>

          <button
            onClick={handleSetupTOTP}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Configurando...</> : <><Smartphone className="w-4 h-4" /> Activar 2FA con Authenticator</>}
          </button>

          <button
            onClick={handleSkip2FA}
            className="w-full py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            Saltar por ahora
          </button>

          <p className="text-xs text-white/30 text-center">Siempre puedes activar 2FA después desde Configuración.</p>
        </div>
      )}

      {/* STEP: TOTP setup (show secret + verify) */}
      {step === 'totp_setup' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Configurar Authenticator</h3>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
            <p className="text-sm text-white/70">Escanea este código QR en Google Authenticator o similar:</p>
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURL)}`}
                alt="TOTP QR"
                className="w-48 h-48 rounded-xl"
              />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">O ingresa manualmente esta clave secreta:</p>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-black/30 rounded-lg text-xs text-cyan-300 font-mono break-all select-all">
                  {totpSecret}
                </code>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(totpSecret); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  className="px-2 py-2 bg-white/5 rounded-lg text-white/40 hover:text-white/80"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400 mt-1">✓ Copiado</p>}
            </div>
          </div>

          <form onSubmit={handleVerifyTOTP} className="space-y-3">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Código de 6 dígitos del Authenticator</label>
              <input
                type="text"
                inputMode="numeric"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading || totpToken.length < 6}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar y activar'}
            </button>
          </form>
        </div>
      )}

      {/* STEP: Backup codes */}
      {step === 'backup_codes' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Códigos de respaldo</h3>
            <p className="text-sm text-white/50 mt-1">Guarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-amber-500/20">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((c, i) => (
                <code key={i} className="text-xs text-amber-300 font-mono bg-black/20 px-2 py-1.5 rounded">{c}</code>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(backupCodes.join('\n'))
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
              }}
              className="mt-3 w-full py-2 text-sm text-white/50 hover:text-white/80 border border-white/10 rounded-lg flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '✓ Copiados' : 'Copiar todos'}
            </button>
          </div>

          <button
            onClick={handleBackupDone}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            He guardado mis códigos — Entrar
          </button>
        </div>
      )}
    </div>
  )
}
