'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Share2, Copy, Check, MessageCircle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { REUNION, getWhatsAppShareLink } from "@/lib/familia"

export default function InvitacionPage() {
  usePageTitle("Invitación")
  const [copied, setCopied] = useState(false)

  const inviteUrl = "https://zafiro.msmmystore.com/familia/encuentro-2026"

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        {/* Invitación Premium */}
        <div className="rounded-3xl overflow-hidden border border-[#D6A83A]/40 bg-gradient-to-b from-[#123B8F]/40 via-[#0a1128] to-[#2F6B45]/20">
          <div className="p-8 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D6A83A] mb-6">Invitación Familiar</div>
            <div className="text-4xl mb-4">🌳</div>
            <h1 className="text-2xl font-bold leading-snug">
              Gran Encuentro Familiar
              <br />
              <span className="text-[#D6A83A]">Soria Martínez</span>
            </h1>

            <div className="my-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#D6A83A]/40" />
              <span className="text-[#D6A83A]">✦</span>
              <div className="h-px w-12 bg-[#D6A83A]/40" />
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-lg font-semibold">16 de Agosto de 2026</p>
              <p className="text-zinc-300">Finca Las Siete Vueltas</p>
              <p className="text-zinc-400 text-xs">Mayarí Arriba, Segundo Frente, Santiago de Cuba</p>
            </div>

            <p className="mt-6 text-sm text-zinc-300 italic leading-relaxed">
              &ldquo;{REUNION.lema}&rdquo;
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-500">
              <span>3 · Fe</span>
              <span>6 · Orden</span>
              <span>9 · Acción</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 space-y-3">
          <a
            href={getWhatsAppShareLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#25D366]/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Compartir por WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-[#2F6B45]" /> : <Copy className="w-5 h-5" />}
            {copied ? "¡Enlace copiado!" : "Copiar enlace privado"}
          </button>
          <Link
            href="/familia/encuentro-2026"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D6A83A] text-[#111827] font-semibold hover:bg-[#D6A83A]/90 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Confirmar mi Asistencia
          </Link>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Evento familiar privado · Nube Familiar ZAFIRO
        </p>
      </div>
    </div>
  )
}
