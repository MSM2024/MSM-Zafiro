'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Lock, Loader2, Eye, EyeOff, Globe, CheckCircle, MessageCircle, ArrowLeft } from 'lucide-react'
import { COUNTRY_CODES, detectCarrier, validatePhone } from '@/lib/phone'

export function AuthForm() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'code' | 'password' | 'done'>('phone')
  const [countryCode, setCountryCode] = useState('52')
  const [showCountries, setShowCountries] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'register' | 'login'>('register')

  const carrier = useMemo(() => {
    if (phone.replace(/\D/g, '').length >= 7) return detectCarrier(phone, countryCode)
    return null
  }, [phone, countryCode])

  const isValid = useMemo(() => validatePhone(phone, countryCode), [phone, countryCode])
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode)
  const fullPhone = countryCode + phone.replace(/\D/g, '')

  const getStoredUser = () => {
    const existing = localStorage.getItem('zafiro_users')
    const users = existing ? JSON.parse(existing) : []
    return users.find((u: any) => u.phone === fullPhone)
  }

  const storeUser = (data: any) => {
    const existing = localStorage.getItem('zafiro_users')
    const users = existing ? JSON.parse(existing) : []
    const idx = users.findIndex((u: any) => u.phone === fullPhone)
    if (idx >= 0) users[idx] = { ...users[idx], ...data }
    else users.push({ phone: fullPhone, carrier: carrier?.name, ...data })
    localStorage.setItem('zafiro_users', JSON.stringify(users))
  }

  const setSession = () => {
    localStorage.setItem('zafiro_user', JSON.stringify({
      phone: fullPhone,
      carrier: carrier?.name || 'Desconocido',
      name: `Usuario Zafiro`,
    }))
  }

  const sendCode = async () => {
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1500))

    const user = getStoredUser()
    if (mode === 'register' && user) {
      setError('Este número ya está registrado. Inicia sesión.')
      setLoading(false)
      return false
    }
    if (mode === 'login' && !user) {
      setError('No hay cuenta con este número. Regístrate.')
      setLoading(false)
      return false
    }

    setLoading(false)
    return true
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) { setError('Número inválido'); return }
    const ok = await sendCode()
    if (ok) setStep('code')
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1000))

    if (code.length < 4) { setError('Código inválido'); setLoading(false); return }

    if (mode === 'register') {
      setStep('password')
    } else {
      setSession()
      setStep('done')
    }
    setLoading(false)
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    setLoading(true)

    storeUser({ password })
    setSession()

    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'register', phone: fullPhone, password, carrier: carrier?.name }),
    }).catch(() => {})

    setLoading(false)
    setStep('done')
  }

  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const user = getStoredUser()
    if (!user || user.password !== password) {
      setError('Teléfono o contraseña incorrectos')
      setLoading(false)
      return
    }

    setSession()
    setLoading(false)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">¡Bienvenido a Zafiro!</h2>
        <p className="text-sm text-white/50">
          {carrier ? `${carrier.name} · ` : ''}+{fullPhone}
        </p>
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

      {step === 'phone' && (
        <form onSubmit={handleSendCode} className="space-y-4">
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
              <>
                <button type="button" onClick={() => { setMode('register'); setError('') }}
                  className="text-sm text-indigo-400 hover:text-indigo-300 block w-full">
                  ¿No tienes cuenta? Regístrate
                </button>
                <button type="button" onClick={() => setStep('password')}
                  className="text-sm text-white/40 hover:text-white/60 block w-full">
                  ¿Olvidaste tu contraseña?
                </button>
              </>
            )}
          </div>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
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

          <button type="button" onClick={handleSendCode}
            className="w-full text-center text-sm text-white/40 hover:text-white/60">
            Reenviar código
          </button>
        </form>
      )}

      {step === 'password' && mode === 'register' && (
        <form onSubmit={handleSetPassword} className="space-y-4">
          <button type="button" onClick={() => setStep('code')}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/60">
            <ArrowLeft className="w-3 h-3" /> Volver
          </button>

          <div className="text-center">
            <p className="text-sm text-emerald-400 font-medium">+{fullPhone} ✓ Verificado</p>
            <p className="text-sm text-white/40 mt-1">Crea una contraseña segura</p>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoFocus
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button type="submit" disabled={loading || password.length < 6}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</> : 'Crear cuenta'}
          </button>
        </form>
      )}

      {step === 'password' && mode === 'login' && (
        <form onSubmit={handleLoginWithPassword} className="space-y-4">
          <button type="button" onClick={() => setStep('phone')}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/60">
            <ArrowLeft className="w-3 h-3" /> Volver
          </button>

          <p className="text-sm text-white/50 text-center">
            Ingresa tu contraseña para <strong className="text-white">+{fullPhone}</strong>
          </p>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              autoFocus
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</> : 'Iniciar sesión'}
          </button>

          <button type="button" onClick={() => setStep('code')}
            className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300">
            Entrar con código de WhatsApp
          </button>
        </form>
      )}
    </div>
  )
}
