'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Briefcase, Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getBusinessProfiles, getProfileById } from "@/lib/identity"
import type { BusinessProfile } from "../../../../packages/types/src/zafiro"

export default function AdminKybPage() {
  usePageTitle("Casos KYB — Admin ZAFIRO")
  const router = useRouter()
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setBusinesses(getBusinessProfiles())
  }, [])

  const stats = useMemo(() => ({
    total: businesses.length,
    pending: businesses.filter(b => b.verificationStatus === "PENDING_REVIEW").length,
    approved: businesses.filter(b => b.verificationStatus === "APPROVED").length,
    rejected: businesses.filter(b => b.verificationStatus === "REJECTED").length,
    notStarted: businesses.filter(b => b.verificationStatus === "NOT_STARTED").length,
  }), [businesses])

  const filtered = useMemo(() => {
    return businesses.filter(b => {
      const matchSearch = !search || b.legalBusinessName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || b.verificationStatus === statusFilter
      const matchRisk = riskFilter === "all" || b.riskLevel === riskFilter
      return matchSearch && matchStatus && matchRisk
    })
  }, [businesses, search, statusFilter, riskFilter])

  const statCards = [
    { label: "Total", value: stats.total, icon: Briefcase, color: "text-[#00D9FF]" },
    { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-amber-400" },
    { label: "Aprobados", value: stats.approved, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Rechazados", value: stats.rejected, icon: XCircle, color: "text-red-400" },
  ]

  const statusLabels: Record<string, string> = {
    NOT_STARTED: "Sin iniciar", IN_PROGRESS: "En progreso", PENDING_REVIEW: "Pendiente",
    APPROVED: "Aprobado", REJECTED: "Rechazado", MORE_INFORMATION_REQUIRED: "Info requerida",
    EXPIRED: "Expirado", SUSPENDED: "Suspendido",
  }

  const statusColors: Record<string, string> = {
    NOT_STARTED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    MORE_INFORMATION_REQUIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Casos KYB</h1>
            <p className="text-[10px] font-mono text-slate-500">Verificación de negocios — Admin ZAFIRO</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
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
              placeholder="Buscar por nombre de negocio..."
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
                <option value="PENDING_REVIEW">Pendiente</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
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
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Negocio</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Propietario</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Riesgo</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Creado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[10px] text-slate-500">
                      No se encontraron negocios
                    </td>
                  </tr>
                ) : filtered.map(b => {
                  const owner = getProfileById(b.ownerProfileId)
                  return (
                    <tr key={b.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-[10px] font-medium text-white">{b.legalBusinessName}</p>
                        {b.tradingName && <p className="text-[8px] text-slate-500">{b.tradingName}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[10px] text-white">{owner?.displayName || "—"}</p>
                        <p className="text-[8px] font-mono text-[#00D9FF]">@{owner?.publicHandle || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-[9px] text-slate-400">{b.entityType || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${statusColors[b.verificationStatus] || ""}`}>
                          {statusLabels[b.verificationStatus] || b.verificationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${riskColors[b.riskLevel || ""] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                          {b.riskLevel || "Sin evaluar"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[9px] text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString("es")}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/kyb/${b.id}`} className="p-1 rounded-lg hover:bg-slate-700/30 transition-colors inline-flex">
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
          Mostrando {filtered.length} de {businesses.length} negocios
        </div>
      </div>
    </div>
  )
}
