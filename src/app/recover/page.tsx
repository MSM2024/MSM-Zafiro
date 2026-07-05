'use client'

import { useState } from 'react'
import {
  Phone, ArrowLeft, Loader2, CheckCircle, Mail, Smartphone, KeyRound,
  ShieldAlert,
} from 'lucide-react'
import Link from 'next/link'

type Step = 'phone' | 'otp' | 'method' | 'email_sent' | 'totp' | 'backup' | 'done'

export default function RecoverPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = async (body: any) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) { setError('Ingresa tu número'); return }
    setLoading(true); setError('')
    const res = await api({ mode: 'send_otp', phone, purpose: 'recovery' })
    if (res.error) { setError(res.error); setLoading(false); return }
    setStep('otp'); setLoading(false)
  }

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) { setError('Código inválido'); return }
    setLoading(true); setError('')
    const res = await api({ mode: 'verify_otp', phone, code, purpose: 'recovery' })
    if (res.error) { setError(res.error); setLoading(false); return }
    setStep('method'); setLoading(false)
  }

  const chooseMethod = (method: 'email' | 'totp' | 'backup') => {
    if (method === 'email') setStep('email_sent')
    else if (method === 'totp') setStep('totp')
    else setStep('backup')
  }

  const verifyBackup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!backupCode.trim()) { setError('Ingresa un código de respaldo'); return }
    setLoading(true); setError('')
    const res = await api({ mode: 'use_backup', code: backupCode.trim() })
    if (res.error) { setError(res.error); setLoading(false); return }
    setStep('done'); setLoading(false)
  }

  const done = () => {
    setStep('done')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <Link href="/auth" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a inicio de sesión
        </Link>

        <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-xl">
          {step === 'phone' && (
            <form onSubmit={sendOTP} className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Recuperar cuenta</h1>
                <p className="text-sm text-white/50 mt-1">Ingresa tu número de teléfono verificado.</p>
              </div>
              {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Número de teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar código a WhatsApp'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verifyOTP} className="space-y-5">
              <button type="button" onClick={() => setStep('phone')}
                className="flex items-center gap-1 text-sm text-white/40 hover:text-white/60">
                <ArrowLeft className="w-3 h-3" /> Cambiar número
              </button>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Código enviado</h1>
                <p className="text-sm text-white/50 mt-1">Código de 6 dígitos enviado a <strong className="text-white/80">{phone}</strong></p>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-emerald-500/50 transition-colors text-center text-2xl tracking-widest"
              />
              <button type="submit" disabled={loading || code.length < 4}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar código'}
              </button>
            </form>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-white">Identidad verificada</h1>
                <p className="text-sm text-white/50 mt-1">Elige cómo recuperar tu cuenta:</p>
              </div>

              <button onClick={() => chooseMethod('email')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Enlace de recuperación</p>
                  <p className="text-xs text-white/40">Recibir enlace en tu email de respaldo</p>
                </div>
              </button>

              <button onClick={() => chooseMethod('totp')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Código Authenticator (2FA)</p>
                  <p className="text-xs text-white/40">Usa Google Authenticator, Authy o similar</p>
                </div>
              </button>

              <button onClick={() => chooseMethod('backup')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Código de respaldo</p>
                  <p className="text-xs text-white/40">Último recurso — código de un solo uso</p>
                </div>
              </button>
            </div>
          )}

          {step === 'email_sent' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Revisa tu email</h1>
              <p className="text-sm text-white/50">Hemos enviado un enlace de recuperación de un solo uso al email registrado en tu cuenta.</p>
              <button onClick={done}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Volver al inicio de sesión
              </button>
            </div>
          )}

          {step === 'totp' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('done') }} className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Código Authenticator</h1>
                <p className="text-sm text-white/50 mt-1">Ingresa el código de 6 dígitos de tu app Authenticator.</p>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors text-center text-2xl tracking-widest"
              />
              <button type="submit" disabled={totpToken.length < 6}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                Verificar
              </button>
            </form>
          )}

          {step === 'backup' && (
            <form onSubmit={verifyBackup} className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Código de respaldo</h1>
                <p className="text-sm text-white/50 mt-1">Ingresa uno de los códigos de 8 caracteres que recibiste al activar 2FA.</p>
              </div>
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="A1B2C3D4"
                maxLength={8}
                required
                autoFocus
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-amber-500/50 transition-colors text-center text-2xl tracking-widest uppercase"
              />
              <button type="submit" disabled={loading || !backupCode.trim()}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar código'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Cuenta verificada</h1>
              <p className="text-sm text-white/50">Tu identidad ha sido verificada exitosamente.</p>
              <Link href="/auth"
                className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
