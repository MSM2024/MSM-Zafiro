'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, TreePine, CheckCircle2, Clock } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { RAMA_PATERNA, RAMA_MATERNA, type FamilyMember } from "@/lib/familia"

const GENERATION_LABELS: Record<string, string> = {
  bisabuelos: "Bisabuelos",
  abuelos: "Abuelos",
  hijos: "Hijos",
  nietos: "Nietos",
}

function MemberCard({ member }: { member: FamilyMember }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#D6A83A]/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">
            {member.firstName} {member.lastName}
            {member.nickname && <span className="text-[#D6A83A] ml-1">&ldquo;{member.nickname}&rdquo;</span>}
          </div>
          <div className="text-xs text-zinc-400 mt-1">{GENERATION_LABELS[member.generation]}</div>
        </div>
        {member.verificationStatus === "confirmed" ? (
          <span title="Confirmado"><CheckCircle2 className="w-4 h-4 text-[#2F6B45]" /></span>
        ) : (
          <span title="Pendiente"><Clock className="w-4 h-4 text-amber-500" /></span>
        )}
      </div>
      {member.isAlive === false && (
        <div className="text-xs text-zinc-500 mt-2 italic">En memoria eterna ✝</div>
      )}
    </div>
  )
}

export default function ArbolPage() {
  usePageTitle("Árbol Genealógico")
  const [search, setSearch] = useState("")

  const filterMembers = (members: FamilyMember[]) =>
    members.filter(m =>
      `${m.firstName} ${m.lastName} ${m.nickname || ""}`.toLowerCase().includes(search.toLowerCase())
    )

  const paterna = filterMembers(RAMA_PATERNA)
  const materna = filterMembers(RAMA_MATERNA)

  const groupByGeneration = (members: FamilyMember[]) => {
    const groups: Record<string, FamilyMember[]> = {}
    for (const m of members) {
      if (!groups[m.generation]) groups[m.generation] = []
      groups[m.generation].push(m)
    }
    return groups
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        <div className="text-center mb-8">
          <TreePine className="w-10 h-10 text-[#D6A83A] mx-auto mb-3" />
          <h1 className="text-2xl md:text-4xl font-bold">Árbol Genealógico</h1>
          <p className="text-zinc-400 mt-2">Familias Soria Macías · Martínez Sablón</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar familiar..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rama Paterna */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#D6A83A]">🌳 Rama Paterna — Soria Macías</h2>
            {Object.entries(groupByGeneration(paterna)).map(([gen, members]) => (
              <div key={gen} className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                  {GENERATION_LABELS[gen]}
                </h3>
                <div className="space-y-2">
                  {members.map(m => <MemberCard key={m.id} member={m} />)}
                </div>
              </div>
            ))}
          </div>

          {/* Rama Materna */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#00D9FF]">🌳 Rama Materna — Martínez Sablón</h2>
            {Object.entries(groupByGeneration(materna)).map(([gen, members]) => (
              <div key={gen} className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                  {GENERATION_LABELS[gen]}
                </h3>
                <div className="space-y-2">
                  {members.map(m => <MemberCard key={m.id} member={m} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-10">
          ✅ Confirmado · 🕐 Pendiente de verificación · Los datos provienen del registro familiar de Don Miguel.
          <br />Ningún dato es inventado — ELIANA marca la información sin confirmar.
        </p>
      </div>
    </div>
  )
}
