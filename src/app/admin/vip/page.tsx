'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Crown, Star, Search, Filter, Eye, Ban, RotateCcw, Briefcase, Clock, AlertTriangle, CheckCircle, CreditCard } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getProfiles, cancelVip } from "@/lib/identity"
import type { Profile, VipStatus } from "../../../../packages/types/src/zafiro"

export default function AdminVipPage() {
  usePageTitle("VIP — Admin ZAFIRO")
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setProfiles(getProfiles().filter(p => p.membershipTier === "VIP" || p.membershipTier === "ENTREPRENEUR_VIP"))
  }, [])

  const vipProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchStatus = statusFilter === "all" || (p.vipStatus || "").includes(statusFilter.toUpperCase())
      const matchSearch = !search || p.displayName.toLowerCase().includes(search.toLowerCase()) || p.publicHandle.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [profiles, statusFilter, search])

  const stats = useMemo(() => ({
    activeVip: profiles.filter(p => p.vipStatus === "VIP_ACTIVE" && p.membershipTier === "VIP").length,
    activeEntrepreneurs: profiles.filter(p => p.vipStatus === "VIP_ACTIVE" && p.membershipTier === "ENTREPRENEUR_VIP").length,
    pendingPayment: profiles.filter(p => p.vipStatus === "VIP_PENDING_PAYMENT").length,
    pastDue: profiles.filter(p => p.vipStatus === "VIP_PAST_DUE").length,
    cancelled: profiles.filter(p => p.vipStatus === "VIP_CANCEL_AT_PERIOD_END").length,
    suspended: profiles.filter(p => p.vipStatus === "VIP_SUSPENDED").length,
  }), [profiles])

  const statCards = [
    { label: "VIP Activos", value: stats.activeVip, icon: Star, color: "text-amber-400" },
    { label: "Emprendedores Activos", value: stats.activeEntrepreneurs, icon: Briefcase, color: "text-purple-400" },
    { label: "Pago Pendiente", value: stats.pendingPayment, icon: CreditCard, color: "text-blue-400" },
    { label: "Pago Vencido", value: stats.pastDue, icon: AlertTriangle, color: "text-red-400" },
    { label: "Cancelados", value: stats.cancelled, icon: Ban, color: "text-slate-400" },
    { label: "Suspendidos", value: stats.suspended, icon: Ban, color: "text-red-400" },
  ]

  const vipStatusLabels: Record<string, string> = {
    VIP_PENDING_PAYMENT: "Pago pendiente",
    VIP_ACTIVE: "Activo",
    VIP_PAST_DUE: "Pago vencido",
    VIP_CANCEL_AT_PERIOD_END: "Cancelado",
    VIP_SUSPENDED: "Suspendido",
    VIP_EXPIRED: "Expirado",
  }

  const vipStatusColors: Record<string, string> = {
    VIP_PENDING_PAYMENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    VIP_ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    VIP_PAST_DUE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    VIP_CANCEL_AT_PERIOD_END: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    VIP_SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
    VIP_EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  const handleCancel = (profileId: string) => {
    cancelVip(profileId)
    setProfiles(getProfiles().filter(p => p.membershipTier === "VIP" || p.membershipTier === "ENTREPRENEUR_VIP"))
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">VIP</h1>
            <p className="text-[10px] font-mono text-slate-500">Gestión de membresías VIP — Admin ZAFIRO</p>
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
              placeholder="Buscar por nombre o handle..."
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
                <option value="active">Activos</option>
                <option value="pending">Pago pendiente</option>
                <option value="past_due">Pago vencido</option>
                <option value="cancelled">Cancelados</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          {vipProfiles.length === 0 ? (
            <div className="p-8 rounded-2xl glass text-center">
              <Crown className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-[10px] text-slate-500">No hay miembros VIP registrados</p>
            </div>
          ) : vipProfiles.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl glass">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    p.membershipTier === "ENTREPRENEUR_VIP"
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                      : "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                  }`}>
                    {p.membershipTier === "ENTREPRENEUR_VIP" ? (
                      <Briefcase className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Star className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.displayName}</p>
                    <p className="text-[9px] font-mono text-slate-500">@{p.publicHandle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                    p.membershipTier === "ENTREPRENEUR_VIP"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {p.membershipTier === "ENTREPRENEUR_VIP" ? "Emprendedor VIP" : "VIP"}
                  </span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${vipStatusColors[p.vipStatus || ""] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                    {vipStatusLabels[p.vipStatus || ""] || "N/A"}
                  </span>
                  <span className="text-[8px] text-slate-600">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(p.createdAt).toLocaleDateString("es")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg hover:bg-slate-700/30 transition-colors" title="Ver perfil">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {(p.vipStatus === "VIP_ACTIVE" || p.vipStatus === "VIP_PAST_DUE") && (
                      <button onClick={() => handleCancel(p.id)} className="p-1 rounded-lg hover:bg-red-900/30 transition-colors" title="Cancelar membresía">
                        <Ban className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                    {(p.vipStatus === "VIP_CANCEL_AT_PERIOD_END" || p.vipStatus === "VIP_SUSPENDED") && (
                      <button className="p-1 rounded-lg hover:bg-emerald-900/30 transition-colors" title="Reactivar">
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
