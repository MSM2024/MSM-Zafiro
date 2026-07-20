'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Users, Search, Shield, Crown, Star, UserCheck, Eye, ChevronDown, ChevronLeft, ChevronRight, Filter, Briefcase, BadgeCheck, Clock, AlertTriangle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getProfiles, getPrivateData } from "@/lib/identity"
import { isOwnerEmail } from "@/lib/owner"
import type { Profile, UserRole, MembershipTier, VerificationStatus } from "../../../../packages/types/src/zafiro"

const PAGE_SIZE = 20

const ROLE_LABELS: Record<string, string> = {
  OWNER_SUPERADMIN: "Superadmin",
  SYSTEM_ADMIN: "Admin",
  FINANCE_ADMIN: "Finanzas",
  CONTENT_ADMIN: "Contenido",
  SECURITY_AUDITOR: "Auditor",
  OPERATOR: "Operador",
  COMPLIANCE_REVIEWER: "Compliance",
  SUPPORT_AGENT: "Soporte",
  ENTREPRENEUR: "Emprendedor",
  USER: "Usuario",
}

const ROLE_COLORS: Record<string, string> = {
  OWNER_SUPERADMIN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SYSTEM_ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  COMPLIANCE_REVIEWER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SUPPORT_AGENT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  ENTREPRENEUR: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  USER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

const TIER_COLORS: Record<string, string> = {
  STANDARD: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  VIP: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ENTREPRENEUR_VIP: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

const VERIF_COLORS: Record<string, string> = {
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  NOT_STARTED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  MORE_INFORMATION_REQUIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
  SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@")
  if (!domain) return email
  return name.slice(0, 2) + "***@" + domain
}

export default function AdminUsuariosPage() {
  usePageTitle("Usuarios — Admin ZAFIRO")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [verifFilter, setVerifFilter] = useState<string>("all")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [privateCache, setPrivateCache] = useState<Record<string, string>>({})
  const [page, setPage] = useState(0)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const s = getSession()
    if (!s) { router.replace("/auth/login"); return }
    if (!isOwnerEmail(s.email)) { setAuthorized(false); return }
    setAuthorized(true)
  }, [router])

  useEffect(() => {
    const all = getProfiles()
    setProfiles(all)

    const cache: Record<string, string> = {}
    for (const p of all) {
      const priv = getPrivateData(p.id)
      if (priv?.email) cache[p.id] = priv.email
    }
    setPrivateCache(cache)
  }, [])

  const stats = useMemo(() => ({
    total: profiles.length,
    standard: profiles.filter(p => p.membershipTier === "STANDARD").length,
    vip: profiles.filter(p => p.membershipTier === "VIP").length,
    entrepreneurVip: profiles.filter(p => p.membershipTier === "ENTREPRENEUR_VIP").length,
    active: profiles.filter(p => p.accountStatus === "ACTIVE").length,
    incomplete: profiles.filter(p => p.verificationStatus === "NOT_STARTED" || p.verificationStatus === "IN_PROGRESS").length,
  }), [profiles])

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const q = search.toLowerCase()
      const matchSearch = !q || p.publicHandle.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q)
      const matchRole = roleFilter === "all" || p.role === roleFilter
      const matchTier = tierFilter === "all" || p.membershipTier === tierFilter
      const matchVerif = verifFilter === "all" || p.verificationStatus === verifFilter
      return matchSearch && matchRole && matchTier && matchVerif
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [profiles, search, roleFilter, tierFilter, verifFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageStart = page * PAGE_SIZE
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  useEffect(() => { setPage(0) }, [search, roleFilter, tierFilter, verifFilter])

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold mb-2">Acceso Denegado</h1>
          <p className="text-xs text-slate-400">Solo el OWNER del sistema puede ver esta secci&oacute;n.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver</Link>
        </div>
      </div>
    )
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al Panel
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-cyan-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Usuarios</h1>
            <p className="text-[10px] font-mono text-slate-500">
              Fuente: <span className="text-[#00D9FF]">localStorage (zafiro_v2_profiles)</span> &middot;
              &Uacute;ltima actualizaci&oacute;n: {new Date().toLocaleString('es-ES')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "text-[#00D9FF]" },
            { label: "Standard", value: stats.standard, icon: UserCheck, color: "text-slate-400" },
            { label: "VIP", value: stats.vip, icon: Star, color: "text-amber-400" },
            { label: "Emprendedor VIP", value: stats.entrepreneurVip, icon: Briefcase, color: "text-purple-400" },
            { label: "Activos", value: stats.active, icon: BadgeCheck, color: "text-emerald-400" },
            { label: "Incompletos", value: stats.incomplete, icon: AlertTriangle, color: "text-amber-400" },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <Icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                <p className="text-lg font-black">{s.value}</p>
                <p className="text-[8px] text-slate-400">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Buscar por handle o nombre..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-[10px]">
              <Filter className="w-3 h-3 text-slate-400" />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todos los roles</option>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-[10px]">
              <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Todas las membres&iacute;as</option>
                <option value="STANDARD">Standard</option>
                <option value="VIP">VIP</option>
                <option value="ENTREPRENEUR_VIP">Emprendedor VIP</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-[10px]">
              <select value={verifFilter} onChange={e => setVerifFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer">
                <option value="all">Toda verificaci&oacute;n</option>
                <option value="APPROVED">Aprobado</option>
                <option value="PENDING_REVIEW">Pendiente</option>
                <option value="REJECTED">Rechazado</option>
                <option value="NOT_STARTED">Sin iniciar</option>
                <option value="IN_PROGRESS">En progreso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Handle</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">UUID</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Membres&iacute;a</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verificaci&oacute;n</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registro</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-[10px] text-slate-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : pageItems.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-mono text-[#00D9FF]">@{p.publicHandle}</td>
                    <td className="px-4 py-3 text-[10px] text-white font-medium">{p.displayName}</td>
                    <td className="px-4 py-3 text-[9px] font-mono text-slate-500">{maskEmail(privateCache[p.id] || '—')}</td>
                    <td className="px-4 py-3 text-[8px] font-mono text-slate-600 max-w-[100px] truncate" title={p.authUserId}>{p.authUserId.slice(0, 12)}...</td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${ROLE_COLORS[p.role] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {ROLE_LABELS[p.role] || p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${TIER_COLORS[p.membershipTier] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {p.membershipTier === "ENTREPRENEUR_VIP" ? "E-VIP" : p.membershipTier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${VERIF_COLORS[p.verificationStatus] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {p.verificationStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                        p.accountStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        p.accountStatus === "SUSPENDED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        p.accountStatus === "INACTIVE" ? "bg-slate-500/10 text-slate-400 border-slate-500/20" :
                        "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {p.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[9px] font-mono text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/perfil/${p.publicHandle}`}
                          className="p-1 rounded-lg hover:bg-slate-700/30 transition-colors" title="Ver perfil">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-[8px] text-slate-600">
            Mostrando {pageStart + 1}&ndash;{Math.min(pageStart + PAGE_SIZE, filtered.length)} de {filtered.length} usuarios
            {filtered.length !== profiles.length && ` (filtrados de ${profiles.length})`}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-[9px] text-slate-500 px-2">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-[8px] text-amber-500/70">
            Fuente: localStorage (zafiro_v2_profiles). No se permiten acciones destructivas desde esta interfaz.
            Los emails aparecen parcialmente protegidos.
          </p>
        </div>
      </div>
    </div>
  )
}
