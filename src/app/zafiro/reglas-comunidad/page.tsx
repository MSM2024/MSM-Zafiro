'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getActiveDocument, type LegalDocument } from '@/lib/legal/terms-engine'
import { ArrowLeft, Users } from 'lucide-react'

export default function ReglasComunidadPage() {
  usePageTitle('Reglas de la Comunidad — ZAFIRO')
  const [doc] = useState<LegalDocument | null>(() => getActiveDocument('community_rules') || null)

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Reglas de la Comunidad</h1>
            {doc && <p className="text-[10px] text-slate-500">Versión {doc.version} · {new Date(doc.createdAt).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass">
          {doc ? (
            <div className="space-y-4">
              {doc.content.split(/\d+\.\s+/).filter(Boolean).map((section, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/60">
                  <p className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap">{section.trim()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Cargando...</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/zafiro/terminos" className="text-[10px] text-slate-500 hover:text-[#00D9FF] underline mx-2">Términos y Condiciones</Link>
          <Link href="/zafiro/privacidad" className="text-[10px] text-slate-500 hover:text-[#00D9FF] underline mx-2">Política de Privacidad</Link>
        </div>
      </div>
    </div>
  )
}
