'use client'

import { useState } from 'react'
import { Phone, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RecoverPage() {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'phone' | 'code' | 'done'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone.trim()) { setError('Ingresa tu número de teléfono'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setStep('code')
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setStep('done')
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Link href="/auth" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a inicio de sesión
      </Link>

      <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-xl">
        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Recuperar cuenta</h1>
              <p className="text-sm text-white/50 mt-1">Ingresa tu número de teléfono para recibir un código de verificación.</p>
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar código'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Código enviado</h1>
              <p className="text-sm text-white/50 mt-1">Hemos enviado un código de 6 dígitos a <strong className="text-white/80">{phone}</strong></p>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Código de verificación</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar código'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-white/40 hover:text-white/60"
            >
              ← Cambiar número
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Cuenta recuperada</h1>
            <p className="text-sm text-white/50">Tu identidad ha sido verificada. Ahora puedes crear una nueva contraseña para acceder a tu cuenta.</p>
            <Link
              href="/auth"
              className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Crear nueva contraseña
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
