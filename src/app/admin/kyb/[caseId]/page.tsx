'use client'

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Briefcase, CheckCircle, XCircle, HelpCircle, FileText, Clock, Users, Building2, MapPin, Globe, Mail, Phone, MessageSquare } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getBusinessProfiles, getBusinessMembers, getEvents, getProfileById, getPrivateData, updateBusinessProfile, recordAdminAction } from "@/lib/identity"
import type { BusinessProfile, BusinessMember, VerificationEvent } from "../../../../../packages/types/src/zafiro"

export default function AdminKybCasePage() {
  usePageTitle("Caso KYB — Admin ZAFIRO")
  const router = useRouter()
  const params = useParams()
  const caseId = params.caseId as string

  const [bizProfile, setBizProfile] = useState<BusinessProfile | null>(null)
  const [members, setMembers] = useState<BusinessMember[]>([])
  const [events, setEvents] = useState<VerificationEvent[]>([])
  const [action, setAction] = useState<"approve" | "reject" | "info" | null>(null)
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [confirmText, setConfirmText] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    if (!caseId) return
    const allBiz = getBusinessProfiles()
    const found = allBiz.find(b => b.id === caseId)
    if (!found) return
    setBizProfile(found)
    setMembers(getBusinessMembers(found.id))
    setEvents(getEvents("business_profile", found.id))
  }, [caseId])

  const owner = useMemo(() => bizProfile ? getProfileById(bizProfile.ownerProfileId) : undefined, [bizProfile])
  const ownerPrivate = useMemo(() => bizProfile ? getPrivateData(bizProfile.ownerProfileId) : undefined, [bizProfile])

  const handleAction = () => {
    if (!bizProfile || !action || confirmText !== "CONFIRMAR") return
    const session = getSession()

    if (action === "approve") {
      updateBusinessProfile(bizProfile.id, { verificationStatus: "APPROVED" })
      recordAdminAction(owner?.id || "", "KYB_APPROVED", "business_profile", bizProfile.id, reason, true)
    } else if (action === "reject") {
      updateBusinessProfile(bizProfile.id, { verificationStatus: "REJECTED" })
      recordAdminAction(owner?.id || "", "KYB_REJECTED", "business_profile", bizProfile.id, reason, true)
    } else if (action === "info") {
      updateBusinessProfile(bizProfile.id, { verificationStatus: "MORE_INFORMATION_REQUIRED" })
      recordAdminAction(owner?.id || "", "KYB_MORE_INFO", "business_profile", bizProfile.id, reason, true)
    }

    const updated = getBusinessProfiles().find(b => b.id === caseId)
    if (updated) {
      setBizProfile(updated)
      setEvents(getEvents("business_profile", updated.id))
    }
    setAction(null)
    setReason("")
    setNote("")
    setConfirmText("")
  }

  const statusLabels: Record<string, string> = {
    NOT_STARTED: "Sin iniciar", IN_PROGRESS: "En progreso", PENDING_REVIEW: "Pendiente",
    APPROVED: "Aprobado", REJECTED: "Rechazado", MORE_INFORMATION_REQUIRED: "Info requerida",
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

  if (!bizProfile) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-[10px] text-slate-500">Negocio no encontrado</p>
          <Link href="/admin/kyb" className="text-[10px] text-[#00D9FF] mt-2 inline-block">← Volver a KYB</Link>
        </div>
      </div>
    )
  }

  const addr = bizProfile.registeredAddress || {}

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/kyb" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a KYB
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Caso KYB</h1>
            <p className="text-[10px] font-mono text-slate-500">{bizProfile.legalBusinessName}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl glass">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#00D9FF]" /> Información del negocio
            </h3>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between"><span className="text-slate-400">Nombre legal</span><span className="text-white font-medium">{bizProfile.legalBusinessName}</span></div>
              {bizProfile.tradingName && <div className="flex justify-between"><span className="text-slate-400">Nombre comercial</span><span className="text-white">{bizProfile.tradingName}</span></div>}
              <div className="flex justify-between"><span className="text-slate-400">Tipo de entidad</span><span className="text-white">{bizProfile.entityType || "—"}</span></div>
              {bizProfile.registrationNumber && <div className="flex justify-between"><span className="text-slate-400">N° Registro</span><span className="text-white font-mono">{bizProfile.registrationNumber.slice(0, 4)}****</span></div>}
              {bizProfile.incorporationCountry && <div className="flex justify-between"><span className="text-slate-400">País</span><span className="text-white">{bizProfile.incorporationCountry}</span></div>}
              {bizProfile.incorporationRegion && <div className="flex justify-between"><span className="text-slate-400">Región</span><span className="text-white">{bizProfile.incorporationRegion}</span></div>}
              {bizProfile.website && <div className="flex justify-between"><span className="text-slate-400">Web</span><span className="text-[#00D9FF]">{bizProfile.website}</span></div>}
              {bizProfile.supportEmail && <div className="flex justify-between"><span className="text-slate-400">Email soporte</span><span className="text-white">{bizProfile.supportEmail}</span></div>}
              {bizProfile.businessCategory && <div className="flex justify-between"><span className="text-slate-400">Categoría</span><span className="text-white">{bizProfile.businessCategory}</span></div>}
              <div className="flex justify-between"><span className="text-slate-400">Estado</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${statusColors[bizProfile.verificationStatus] || ""}`}>
                  {statusLabels[bizProfile.verificationStatus] || bizProfile.verificationStatus}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Riesgo</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${riskColors[bizProfile.riskLevel || ""] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                  {bizProfile.riskLevel || "Sin evaluar"}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Creado</span><span className="text-white">{new Date(bizProfile.createdAt).toLocaleDateString("es")}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl glass">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-amber-400" /> Propietario y miembros
            </h3>
            <div className="space-y-2 text-[10px] mb-3 pb-3 border-b border-slate-700/30">
              <div className="flex justify-between"><span className="text-slate-400">Propietario</span><span className="text-white">{owner?.displayName || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Handle</span><span className="text-[#00D9FF] font-mono">@{owner?.publicHandle || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white">{ownerPrivate?.email || "—"}</span></div>
            </div>

            {members.length === 0 ? (
              <p className="text-[9px] text-slate-500">No hay miembros registrados</p>
            ) : (
              <div className="space-y-1.5">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-slate-700/30">
                    <div>
                      <p className="text-[9px] text-white font-medium">{m.fullName}</p>
                      <p className="text-[7px] text-slate-500">{m.controlRole}{m.ownershipPercentage ? ` · ${m.ownershipPercentage}%` : ""}</p>
                    </div>
                    <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded-full ${
                      m.kycStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" :
                      m.kycStatus === "PENDING_REVIEW" ? "bg-amber-500/10 text-amber-400" :
                      "bg-slate-500/10 text-slate-400"
                    }`}>{m.kycStatus}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl glass mb-6">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-purple-400" /> Documentos
          </h3>
          <div className="space-y-1.5">
            {["Documentos de constitución", "Identificación del propietario", "Comprobante de domicilio", "Estado financiero"].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-slate-700/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span className="text-[9px] text-slate-400">{doc}</span>
                </div>
                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400">Pendiente</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl glass mb-6">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Eventos ({events.length})
          </h3>
          {events.length === 0 ? (
            <p className="text-[9px] text-slate-500">No hay eventos registrados</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {events.map(e => (
                <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-slate-700/30">
                  <div>
                    <p className="text-[9px] text-white font-mono">{e.eventType}</p>
                    {e.previousStatus && <p className="text-[7px] text-slate-500">{e.previousStatus} → {e.newStatus}</p>}
                  </div>
                  <span className="text-[7px] text-slate-600">{new Date(e.createdAt).toLocaleString("es")}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {bizProfile.verificationStatus !== "APPROVED" && bizProfile.verificationStatus !== "REJECTED" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl glass">
            <h3 className="text-xs font-bold text-white mb-3">Acciones del revisor</h3>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setAction("approve")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${action === "approve" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "glass text-emerald-400 hover:bg-emerald-500/10"}`}>
                <CheckCircle className="w-3.5 h-3.5" /> Aprobar
              </button>
              <button onClick={() => setAction("reject")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${action === "reject" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "glass text-red-400 hover:bg-red-500/10"}`}>
                <XCircle className="w-3.5 h-3.5" /> Rechazar
              </button>
              <button onClick={() => setAction("info")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${action === "info" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "glass text-orange-400 hover:bg-orange-500/10"}`}>
                <HelpCircle className="w-3.5 h-3.5" /> Solicitar info
              </button>
            </div>

            {action && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">Razón</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej: DOCUMENTS_VALID..."
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">Nota interna</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Nota interna..."
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30 h-16 resize-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">Escribe <span className="text-[#00D9FF] font-bold">CONFIRMAR</span> para ejecutar</label>
                  <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRMAR"
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30" />
                </div>
                <button
                  onClick={handleAction}
                  disabled={confirmText !== "CONFIRMAR"}
                  className={`w-full py-2 rounded-lg text-[10px] font-bold transition-all ${
                    confirmText === "CONFIRMAR"
                      ? action === "approve" ? "bg-emerald-500 text-white hover:bg-emerald-400" :
                        action === "reject" ? "bg-red-500 text-white hover:bg-red-400" :
                        "bg-orange-500 text-white hover:bg-orange-400"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {action === "approve" ? "Aprobar negocio" : action === "reject" ? "Rechazar negocio" : "Solicitar información"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
