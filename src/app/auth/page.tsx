'use client'

import { AuthForm } from '@/components/AuthForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <img src="/assets/ai-logo.svg" alt="" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-white">MSM Zafiro</h1>
            <p className="text-white/50 text-sm mt-1">
              Únete a la red social del conocimiento + IA
            </p>
          </div>

          <AuthForm />
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Al continuar, aceptas nuestros{' '}
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Términos</Link>
          {' '}y{' '}
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Política de Privacidad</Link>
        </p>
      </div>
    </div>
  )
}
