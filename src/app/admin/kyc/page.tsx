'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Shield, Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertTriangle, FileText, HelpCircle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getKycCases, getProfileById } from "@/lib/identity"
import type { KycCase } from "../../../../packages/types/src/zafiro"

export default function AdminKycPage() {
  usePageTitle("Casos KYC — Admin ZAFIRO")
  const router = useRouter()
  const [cases, setCases] = useState<KycCase[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setCases(getKycCases())
  }, [])

  const stats = useMemo(() => ({
    total: cases.length,
    pending: cases.filter(c => c.status === "PENDING_REVIEW").length,
    approved: cases.filter(c => c.status === "APPROVED").length,
    rejected: cases.filter(c => c.status === "REJECTED").length,
    moreInfo: cases.filter(c => c.status === "MORE_INFORMATION_REQUIRED").length,
    notStarted: cases.filter(c => c.status === "NOT_STARTED").length,
    inProgress: cases.filter(c => c.status === "IN_PROGRESS").length,
  }), [cases])

  const filtered = useMemo(() => {
    return cases.filter(c => {
      const profile = getProfileById(c.profileId)
      const matchSearch = !search || (profile?.publicHandle.toLowerCase().includes(search.toLowerCase()) || profile?.displayName.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      const matchRisk = riskFilter === "all" || c.riskLevel === riskFilter
      return matchSearch && matchStatus && matchRisk
    })
  }, [cases, search, statusFilter, riskFilter])

  const statCards = [
    { label: "Total", value: stats.total, icon: FileText, color: "text-[#00D9FF]" },
    { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-amber-400" },
    { label: "Aprobados", value: stats.approved, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Rechazados", value: stats.rejected, icon: XCircle, color: "text-red-400" },
    { label: "Info requerida", value: stats.moreInfo, icon: HelpCircle, color: "text-orange-400" },
    { label: "Sin iniciar", value: stats.notStarted, icon: AlertTriangle, color: "text-slate-400" },
  ]

  const statusLabels: Record<string, string> = {
    NOT_STARTED: "Sin iniciar",
    IN_PROGRESS: "En progreso",
    PENDING_REVIEW: "Pendiente",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    MORE_INFORMATION_REQUIRED: "Info requerida",
    EXPIRED: "Expirado",
    SUSPENDED: "Suspendido",
  }

  const statusColors: Record<string, string> = {
    NOT_STARTED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    MORE_INFORMATION_REQUIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
    SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  const riskColors: Record<string, string> = {
    LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
    PROHIBITED: "bg-red-600/10 text-red-300 border-red-600/20",
    MANUAL_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Casos KYC</h1>
            <p className="text-[10px] font-mono text-slate-500">Verificación de identidad — Admin ZAFIRO</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="p-3 rounded-2xl glass">
                <Icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                <p className="text-lg font-black">{s.value}</p>
                <p className="text-[8px] text-slate-400">{s.label}</p>
              </div>
            )
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 space-y-3">
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
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[10px]">
              <Filter className="w-3 h-3 text-slate-400" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todos los estados</option>
                <option value="NOT_STARTED">Sin iniciar</option>
                <option value="IN_PROGRESS">En progreso</option>
                <option value="PENDING_REVIEW">Pendiente</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
                <option value="MORE_INFORMATION_REQUIRED">Info requerida</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[10px]">
              <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todos los niveles de riesgo</option>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
                <option value="PROHIBITED">Prohibido</option>
                <option value="MANUAL_REVIEW">Revisión manual</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Riesgo</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Enviado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Revisado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[10px] text-slate-500">
                      No se encontraron casos KYC
                    </td>
                  </tr>
                ) : filtered.map(c => {
                  const profile = getProfileById(c.profileId)
                  return (
                    <tr key={c.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-[10px] font-medium text-white">{profile?.displayName || "—"}</p>
                          <p className="text-[8px] font-mono text-[#00D9FF]">@{profile?.publicHandle || "—"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${statusColors[c.status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                          {statusLabels[c.status] || c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${riskColors[c.riskLevel || ""] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                          {c.riskLevel || "Sin evaluar"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[9px] text-slate-400">
                        {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString("es") : "—"}
                      </td>
                      <td className="px-4 py-3 text-[9px] text-slate-400">
                        {c.reviewedAt ? new Date(c.reviewedAt).toLocaleDateString("es") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/kyc/${c.id}`} className="p-1 rounded-lg hover:bg-slate-700/30 transition-colors inline-flex">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-4 text-[8px] text-slate-600 text-center">
          Mostrando {filtered.length} de {cases.length} casos
        </div>
      </div>
    </div>
  )
}
