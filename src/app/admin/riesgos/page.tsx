'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, AlertTriangle, Search, Eye, MessageSquare, Shield, ArrowUpCircle, Ban, AlertOctagon } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getKycCases, getProfileById } from "@/lib/identity"
import type { KycCase } from "../../../../packages/types/src/zafiro"

export default function AdminRiesgosPage() {
  usePageTitle("Riesgos — Admin ZAFIRO")
  const router = useRouter()
  const [cases, setCases] = useState<KycCase[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setCases(getKycCases().filter(c =>
      c.riskLevel === "HIGH" || c.riskLevel === "PROHIBITED" || c.riskLevel === "MANUAL_REVIEW"
    ))
  }, [])

  const stats = useMemo(() => ({
    high: cases.filter(c => c.riskLevel === "HIGH").length,
    prohibited: cases.filter(c => c.riskLevel === "PROHIBITED").length,
    manualReview: cases.filter(c => c.riskLevel === "MANUAL_REVIEW").length,
  }), [cases])

  const filtered = useMemo(() => {
    return cases.filter(c => {
      const profile = getProfileById(c.profileId)
      return !search || profile?.publicHandle.toLowerCase().includes(search.toLowerCase()) || profile?.displayName.toLowerCase().includes(search.toLowerCase())
    })
  }, [cases, search])

  const riskColors: Record<string, string> = {
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
    PROHIBITED: "bg-red-600/20 text-red-300 border-red-600/30",
    MANUAL_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  const riskLabels: Record<string, string> = {
    HIGH: "Riesgo alto",
    PROHIBITED: "Prohibido",
    MANUAL_REVIEW: "Revisión manual",
  }

  const statusLabels: Record<string, string> = {
    NOT_STARTED: "Sin iniciar", IN_PROGRESS: "En progreso", PENDING_REVIEW: "Pendiente",
    APPROVED: "Aprobado", REJECTED: "Rechazado", MORE_INFORMATION_REQUIRED: "Info requerida",
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-[10px] text-red-400 font-bold">Estos casos requieren atención prioritaria</p>
          </div>
          <p className="text-[8px] text-red-400/60 mt-1">Los casos de alto riesgo, prohibidos o en revisión manual necesitan revisión inmediata.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Riesgos</h1>
            <p className="text-[10px] font-mono text-slate-500">Casos de alto riesgo — Admin ZAFIRO</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 rounded-2xl glass">
            <AlertTriangle className="w-4 h-4 text-red-400 mb-1.5" />
            <p className="text-lg font-black">{stats.high}</p>
            <p className="text-[8px] text-slate-400">Riesgo alto</p>
          </div>
          <div className="p-3 rounded-2xl glass">
            <Ban className="w-4 h-4 text-red-300 mb-1.5" />
            <p className="text-lg font-black">{stats.prohibited}</p>
            <p className="text-[8px] text-slate-400">Prohibidos</p>
          </div>
          <div className="p-3 rounded-2xl glass">
            <AlertOctagon className="w-4 h-4 text-purple-400 mb-1.5" />
            <p className="text-lg font-black">{stats.manualReview}</p>
            <p className="text-[8px] text-slate-400">Revisión manual</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl glass">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por handle o nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-2xl glass text-center">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-[10px] text-slate-500">No hay casos de alto riesgo pendientes</p>
            </div>
          ) : filtered.map(c => {
            const profile = getProfileById(c.profileId)
            const riskLevel = c.riskLevel || ""
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl glass border ${riskColors[c.riskLevel || ""]?.split(" ").find(c => c.startsWith("border-")) || "border-slate-700/30"}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      c.riskLevel === "PROHIBITED" ? "bg-red-600/20" :
                      c.riskLevel === "HIGH" ? "bg-red-500/20" :
                      "bg-purple-500/20"
                    }`}>
                      {riskLevel === "PROHIBITED" ? <Ban className="w-5 h-5 text-red-300" /> : riskLevel === "HIGH" ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <AlertOctagon className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white">{profile?.displayName || "—"}</p>
                      <p className="text-[8px] font-mono text-[#00D9FF]">@{profile?.publicHandle || "—"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[7px] font-mono px-2 py-0.5 rounded-full border ${riskColors[c.riskLevel || ""] || ""}`}>
                          {riskLabels[c.riskLevel || ""] || c.riskLevel}
                        </span>
                        <span className="text-[7px] font-mono px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          {statusLabels[c.status] || c.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/admin/kyc/${c.id}`} className="p-1.5 rounded-lg hover:bg-slate-700/30 transition-colors" title="Revisar caso">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-amber-900/30 transition-colors" title="Escalar">
                      <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-900/30 transition-colors" title="Agregar nota">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-[7px] text-slate-600">
                  Creado: {new Date(c.createdAt).toLocaleString("es")}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
