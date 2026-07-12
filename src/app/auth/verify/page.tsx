'use client'

import Link from "next/link"
import { Gem, Mail, ShieldCheck } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

export default function VerifyPage() {
  usePageTitle("Verificar Cuenta")
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Gem className="w-8 h-8 text-[#00D9FF]" />
          <span className="text-lg font-black">ZAFIRO</span>
        </Link>

        <div className="p-6 rounded-3xl border border-slate-800 bg-[#0B1220]/60 text-center">
          <div className="w-14 h-14 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-[#00D9FF]" />
          </div>
          <h1 className="text-xl font-black mb-2">Verifica tu Correo</h1>
          <p className="text-xs text-slate-400 mb-4">Hemos enviado un código de verificación a tu correo electrónico.</p>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Código de Verificación</label>
              <div className="flex gap-2 mt-1 justify-center">
                {[0,1,2,3,4,5].map((i) => (
                  <input key={i} type="text" maxLength={1} className="w-10 h-12 bg-slate-950/80 border border-slate-800 rounded-xl text-center text-lg font-bold text-white focus:border-[#00D9FF] outline-none" />
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
              Verificar
            </button>
          </form>
          <p className="text-[10px] text-slate-500 mt-4">¿No recibiste el código? <button className="text-[#00D9FF] hover:underline cursor-pointer">Reenviar</button></p>
        </div>
      </div>
    </div>
  )
}
