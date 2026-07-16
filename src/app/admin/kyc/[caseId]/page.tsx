'use client'

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Shield, CheckCircle, XCircle, HelpCircle, FileText, Clock, AlertTriangle, MessageSquare, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getKycCases, getKycDocuments, getKycReviews, getEvents, getProfileById, getPrivateData, approveKyc, rejectKyc, requestKycInfo, recordAdminAction } from "@/lib/identity"
import type { KycCase, KycDocument, KycReview, VerificationEvent } from "../../../../../packages/types/src/zafiro"

export default function AdminKycCasePage() {
  usePageTitle("Caso KYC — Admin ZAFIRO")
  const router = useRouter()
  const params = useParams()
  const caseId = params.caseId as string

  const [kycCase, setKycCase] = useState<KycCase | null>(null)
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [reviews, setReviews] = useState<KycReview[]>([])
  const [events, setEvents] = useState<VerificationEvent[]>([])
  const [action, setAction] = useState<"approve" | "reject" | "info" | null>(null)
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => {
    if (!caseId) return
    const allCases = getKycCases()
    const found = allCases.find(c => c.id === caseId)
    if (!found) return
    setKycCase(found)
    setDocuments(getKycDocuments(found.id))
    setReviews(getKycReviews(found.id))
    setEvents(getEvents("kyc_case", found.id))
  }, [caseId])

  const profile = useMemo(() => kycCase ? getProfileById(kycCase.profileId) : undefined, [kycCase])
  const privateData = useMemo(() => kycCase ? getPrivateData(kycCase.profileId) : undefined, [kycCase])

  const handleAction = () => {
    if (!kycCase || !action || confirmText !== "CONFIRMAR") return
    setActionLoading(true)
    const session = getSession()

    if (action === "approve") {
      approveKyc(kycCase.id, profile?.id || "", reason || undefined, note || undefined)
      recordAdminAction(profile?.id || "", "KYC_APPROVED", "kyc_case", kycCase.id, reason, true)
    } else if (action === "reject") {
      rejectKyc(kycCase.id, profile?.id || "", reason || "NO_REASON", note || undefined)
      recordAdminAction(profile?.id || "", "KYC_REJECTED", "kyc_case", kycCase.id, reason, true)
    } else if (action === "info") {
      requestKycInfo(kycCase.id, profile?.id || "", reason || "MORE_INFO")
      recordAdminAction(profile?.id || "", "KYC_MORE_INFO", "kyc_case", kycCase.id, reason, true)
    }

    // Refresh
    const updated = getKycCases().find(c => c.id === caseId)
    if (updated) {
      setKycCase(updated)
      setReviews(getKycReviews(updated.id))
      setEvents(getEvents("kyc_case", updated.id))
    }
    setAction(null)
    setReason("")
    setNote("")
    setConfirmText("")
    setActionLoading(false)
  }

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

  if (!kycCase) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-[10px] text-slate-500">Caso no encontrado</p>
          <Link href="/admin/kyc" className="text-[10px] text-[#00D9FF] mt-2 inline-block">← Volver a KYC</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/kyc" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a KYC
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Caso KYC</h1>
            <p className="text-[10px] font-mono text-slate-500">{kycCase.id.slice(0, 8)}...</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl glass">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#00D9FF]" /> Información del perfil
            </h3>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between"><span className="text-slate-400">Nombre</span><span className="text-white font-medium">{profile?.displayName || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Handle</span><span className="text-[#00D9FF] font-mono">@{profile?.publicHandle || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white">{privateData?.email || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Rol</span><span className="text-white">{profile?.role || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Estado</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${statusColors[kycCase.status] || ""}`}>
                  {statusLabels[kycCase.status] || kycCase.status}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Riesgo</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${riskColors[kycCase.riskLevel || ""] || ""}`}>
                  {kycCase.riskLevel || "Sin evaluar"}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Creado</span><span className="text-white">{new Date(kycCase.createdAt).toLocaleDateString("es")}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl glass">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Documentos ({documents.length})
            </h3>
            {documents.length === 0 ? (
              <p className="text-[9px] text-slate-500">No hay documentos subidos</p>
            ) : (
              <div className="space-y-1.5">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-slate-700/30">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-white truncate">{doc.fileName || doc.documentType}</p>
                        <p className="text-[7px] text-slate-500">{doc.documentType} · {doc.status}</p>
                      </div>
                    </div>
                    <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded-full ${
                      doc.status === "uploaded" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                    }`}>{doc.status}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl glass mb-6">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Historial de revisiones ({reviews.length})
          </h3>
          {reviews.length === 0 ? (
            <p className="text-[9px] text-slate-500">No hay revisiones registradas</p>
          ) : (
            <div className="space-y-1.5">
              {reviews.map(r => (
                <div key={r.id} className="p-2 rounded-lg bg-slate-800/20 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${
                      r.decision === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" :
                      r.decision === "REJECTED" ? "bg-red-500/10 text-red-400" :
                      "bg-orange-500/10 text-orange-400"
                    }`}>{r.decision}</span>
                    <span className="text-[7px] text-slate-500">{new Date(r.decidedAt).toLocaleString("es")}</span>
                  </div>
                  {r.reasonCode && <p className="text-[8px] text-slate-400">Razón: {r.reasonCode}</p>}
                  {r.internalNote && <p className="text-[8px] text-slate-500 italic">Nota: {r.internalNote}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl glass mb-6">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Eventos ({events.length})
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

        {kycCase.status !== "APPROVED" && kycCase.status !== "REJECTED" && (
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
                  <label className="text-[9px] text-slate-400 block mb-1">Razón / Reason code</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej: DOCUMENTS_VALID, INSUFFICIENT_PROOF..."
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">Nota interna (opcional)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Nota interna para el registro de auditoría..."
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30 h-16 resize-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">Escribe <span className="text-[#00D9FF] font-bold">CONFIRMAR</span> para ejecutar</label>
                  <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRMAR"
                    className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-slate-600 outline-none focus:border-[#00D9FF]/30" />
                </div>
                <button
                  onClick={handleAction}
                  disabled={confirmText !== "CONFIRMAR" || actionLoading}
                  className={`w-full py-2 rounded-lg text-[10px] font-bold transition-all ${
                    confirmText === "CONFIRMAR"
                      ? action === "approve" ? "bg-emerald-500 text-white hover:bg-emerald-400" :
                        action === "reject" ? "bg-red-500 text-white hover:bg-red-400" :
                        "bg-orange-500 text-white hover:bg-orange-400"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {actionLoading ? "Procesando..." : action === "approve" ? "Aprobar caso" : action === "reject" ? "Rechazar caso" : "Solicitar información"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
