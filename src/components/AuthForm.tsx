'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

type Mode = 'login' | 'register'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error de autenticación')
        return
      }

      if (mode === 'register') {
        setSuccess('Cuenta creada. Revisa tu email para confirmar.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Error de conexión. Modo demo activado.')
      localStorage.setItem('zafiro_user', JSON.stringify({ email, name: email.split('@')[0] }))
      setTimeout(() => router.push('/'), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm text-white/60 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1.5">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
            required
            minLength={6}
            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
        ) : mode === 'register' ? (
          'Crear cuenta'
        ) : (
          'Iniciar sesión'
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs text-white/30 bg-[#070314]">O continúa con</span></div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'Google', icon: 'G' },
          { name: 'GitHub', icon: 'GH' },
          { name: 'Apple', icon: 'A' },
        ].map((provider) => (
          <button
            key={provider.name}
            type="button"
            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            onClick={() => {
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
              if (supabaseUrl) {
                window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=${provider.name.toLowerCase()}`
              } else {
                localStorage.setItem('zafiro_user', JSON.stringify({ email: `${provider.name.toLowerCase()}@demo.com`, name: `Usuario ${provider.name}` }))
                router.push('/')
              }
            }}
          >
            {provider.icon}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-white/40 mt-4">
        {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button
          type="button"
          onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); setSuccess('') }}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {mode === 'register' ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </p>
    </form>
  )
}
