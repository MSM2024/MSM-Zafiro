'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Clock, Search, Filter, FileText, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getEvents } from "@/lib/identity"
import type { VerificationEvent } from "../../../../packages/types/src/zafiro"

export default function AdminAuditoriaPage() {
  usePageTitle("Auditoría — Admin ZAFIRO")
  const router = useRouter()
  const [events, setEvents] = useState<VerificationEvent[]>([])
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 25

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !search || e.operationId.toLowerCase().includes(search.toLowerCase()) || e.eventType.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === "all" || e.entityType === typeFilter
      const matchEntity = entityFilter === "all" || e.entityType === entityFilter
      return matchSearch && matchType && matchEntity
    })
  }, [events, search, typeFilter, entityFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const entityTypeLabels: Record<string, string> = {
    profile: "Perfil",
    kyc_case: "KYC",
    business_profile: "KYB",
    admin_action: "Admin",
    consent: "Consentimiento",
  }

  const eventColors: Record<string, string> = {
    CREATED: "bg-blue-500/10 text-blue-400",
    STATUS_APPROVED: "bg-emerald-500/10 text-emerald-400",
    STATUS_REJECTED: "bg-red-500/10 text-red-400",
    STATUS_PENDING_REVIEW: "bg-amber-500/10 text-amber-400",
    STATUS_MORE_INFORMATION_REQUIRED: "bg-orange-500/10 text-orange-400",
    STATUS_IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    OWNER_BOOTSTRAPPED: "bg-purple-500/10 text-purple-400",
    KYC_APPROVED: "bg-emerald-500/10 text-emerald-400",
    KYC_REJECTED: "bg-red-500/10 text-red-400",
    KYC_MORE_INFO: "bg-orange-500/10 text-orange-400",
  }

  const uniqueEntityTypes = useMemo(() => {
    const types = new Set(events.map(e => e.entityType))
    return Array.from(types)
  }, [events])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Auditoría</h1>
            <p className="text-[10px] font-mono text-slate-500">Registro de eventos — Admin ZAFIRO</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-xl glass">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por operation ID o tipo de evento..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[10px]">
              <Filter className="w-3 h-3 text-slate-400" />
              <select value={entityFilter} onChange={e => { setEntityFilter(e.target.value); setPage(1) }} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todas las entidades</option>
                {uniqueEntityTypes.map(t => (
                  <option key={t} value={t}>{entityTypeLabels[t] || t}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Entidad</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actor</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Anterior → Nuevo</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Operation ID</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[10px] text-slate-500">
                      No hay eventos registrados
                    </td>
                  </tr>
                ) : paged.map(e => (
                  <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-[9px] text-slate-400 whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString("es")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${eventColors[e.eventType] || "bg-slate-500/10 text-slate-400"}`}>
                        {e.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[8px] font-mono text-slate-400">
                        {entityTypeLabels[e.entityType] || e.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[8px] text-slate-400 font-mono">
                      {e.actorProfileId ? e.actorProfileId.slice(0, 8) + "..." : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {e.previousStatus || e.newStatus ? (
                        <span className="text-[8px] text-slate-400">
                          {e.previousStatus && <span className="text-slate-500">{e.previousStatus}</span>}
                          {e.previousStatus && e.newStatus && <span className="text-slate-600 mx-1">→</span>}
                          {e.newStatus && <span className="text-white">{e.newStatus}</span>}
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[7px] font-mono text-slate-500">
                        {e.operationId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded-lg text-[9px] glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Anterior
            </button>
            <span className="text-[9px] text-slate-500">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded-lg text-[9px] glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Siguiente
            </button>
          </div>
        )}

        <div className="mt-4 text-[8px] text-slate-600 text-center">
          {filtered.length} eventos
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 p-4 rounded-2xl border border-amber-500/10 bg-amber-500/5">
          <p className="text-[9px] text-amber-400/80 text-center">
            Este registro es de solo lectura y append-only. No se puede modificar ni eliminar.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
