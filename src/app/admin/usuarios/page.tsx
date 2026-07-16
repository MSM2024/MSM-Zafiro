'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Users, Search, Shield, Crown, Star, UserCheck, Ban, Eye, ChevronDown, Filter, UserX, Briefcase, BadgeCheck, Clock } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getProfiles, getProfileById } from "@/lib/identity"
import type { Profile, UserRole, MembershipTier, VerificationStatus, AccountStatus } from "../../../../packages/types/src/zafiro"

export default function AdminUsuariosPage() {
  usePageTitle("Usuarios — Admin ZAFIRO")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [verifFilter, setVerifFilter] = useState<string>("all")
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    setProfiles(getProfiles())
  }, [])

  const stats = useMemo(() => ({
    total: profiles.length,
    standard: profiles.filter(p => p.membershipTier === "STANDARD").length,
    vip: profiles.filter(p => p.membershipTier === "VIP").length,
    entrepreneurVip: profiles.filter(p => p.membershipTier === "ENTREPRENEUR_VIP").length,
    active: profiles.filter(p => p.accountStatus === "ACTIVE").length,
    suspended: profiles.filter(p => p.accountStatus === "SUSPENDED").length,
  }), [profiles])

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const matchSearch = !search || p.publicHandle.toLowerCase().includes(search.toLowerCase()) || p.displayName.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === "all" || p.role === roleFilter
      const matchTier = tierFilter === "all" || p.membershipTier === tierFilter
      const matchVerif = verifFilter === "all" || p.verificationStatus === verifFilter
      return matchSearch && matchRole && matchTier && matchVerif
    })
  }, [profiles, search, roleFilter, tierFilter, verifFilter])

  const statCards = [
    { label: "Total", value: stats.total, icon: Users, color: "text-[#00D9FF]" },
    { label: "Standard", value: stats.standard, icon: UserCheck, color: "text-slate-400" },
    { label: "VIP", value: stats.vip, icon: Star, color: "text-amber-400" },
    { label: "Emprendedor VIP", value: stats.entrepreneurVip, icon: Briefcase, color: "text-purple-400" },
    { label: "Activos", value: stats.active, icon: BadgeCheck, color: "text-emerald-400" },
    { label: "Suspendidos", value: stats.suspended, icon: Ban, color: "text-red-400" },
  ]

  const roleLabels: Record<string, string> = {
    OWNER_SUPERADMIN: "Superadmin",
    ADMIN: "Admin",
    COMPLIANCE_REVIEWER: "Compliance",
    SUPPORT_AGENT: "Soporte",
    ENTREPRENEUR: "Emprendedor",
    USER: "Usuario",
  }

  const roleColors: Record<string, string> = {
    OWNER_SUPERADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
    ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    COMPLIANCE_REVIEWER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SUPPORT_AGENT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    ENTREPRENEUR: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    USER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  }

  const tierColors: Record<string, string> = {
    STANDARD: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    VIP: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ENTREPRENEUR_VIP: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  const verifColors: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    NOT_STARTED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MORE_INFORMATION_REQUIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
    SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-cyan-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Usuarios</h1>
            <p className="text-[10px] font-mono text-slate-500">Gestión de usuarios — Admin ZAFIRO</p>
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
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todos los roles</option>
                <option value="OWNER_SUPERADMIN">Superadmin</option>
                <option value="ADMIN">Admin</option>
                <option value="COMPLIANCE_REVIEWER">Compliance</option>
                <option value="SUPPORT_AGENT">Soporte</option>
                <option value="ENTREPRENEUR">Emprendedor</option>
                <option value="USER">Usuario</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[10px]">
              <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todas las membresías</option>
                <option value="STANDARD">Standard</option>
                <option value="VIP">VIP</option>
                <option value="ENTREPRENEUR_VIP">Emprendedor VIP</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[10px]">
              <select value={verifFilter} onChange={e => setVerifFilter(e.target.value)} className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Toda verificación</option>
                <option value="APPROVED">Aprobado</option>
                <option value="PENDING_REVIEW">Pendiente</option>
                <option value="REJECTED">Rechazado</option>
                <option value="NOT_STARTED">Sin iniciar</option>
                <option value="IN_PROGRESS">En progreso</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Handle</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Membresía</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verificación</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[10px] text-slate-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-mono text-[#00D9FF]">@{p.publicHandle}</td>
                    <td className="px-4 py-3 text-[10px] text-white font-medium">{p.displayName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${roleColors[p.role] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {roleLabels[p.role] || p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${tierColors[p.membershipTier] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {p.membershipTier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${verifColors[p.verificationStatus] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {p.verificationStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                        p.accountStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        p.accountStatus === "SUSPENDED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {p.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded-lg hover:bg-slate-700/30 transition-colors" title="Ver perfil">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        {p.accountStatus !== "SUSPENDED" && (
                          <button className="p-1 rounded-lg hover:bg-red-900/30 transition-colors" title="Suspender">
                            <Ban className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-4 text-[8px] text-slate-600 text-center">
          Mostrando {filtered.length} de {profiles.length} usuarios
        </div>
      </div>
    </div>
  )
}
