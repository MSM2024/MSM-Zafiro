'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Shield, BarChart3, Clock, Sliders, RefreshCw, AlertTriangle, Trash2, Tag, Key, CheckCircle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import GlassCard from "@/components/ui/GlassCard"
import GmailConnect from "@/components/email-cleaner/GmailConnect"
import AnalysisReport from "@/components/email-cleaner/AnalysisReport"
import ActionPanel from "@/components/email-cleaner/ActionPanel"
import ClassificationRules from "@/components/email-cleaner/ClassificationRules"
import AuditLog from "@/components/email-cleaner/AuditLog"
import type { GmailAccount, EmailAnalysis, CleanAction, AuditEntry, ClassificationRule } from "@/lib/email-cleaner/types"
import { DEFAULT_TRUSTED_DOMAINS, DEFAULT_TRUSTED_EMAILS, createDefaultAutomation } from "@/lib/email-cleaner/types"
import { loadAccounts, saveAccounts, loadAnalysis, saveAnalysis, loadPendingActions, savePendingActions, loadAuditEntries, saveAuditEntries, loadTrustedDomains, saveTrustedDomains, loadTrustedEmails, loadClassificationRules, saveClassificationRules, loadAutomation, saveAutomation, clearAllData } from "@/lib/email-cleaner/persistence"

type SectionId = 'accounts' | 'oauth' | 'space' | 'spam' | 'promotions' | 'large-files' | 'trusted' | 'rules' | 'history' | 'pending' | 'revoke' | 'automation'

interface Section { id: SectionId; label: string; icon: typeof Mail; description: string }

const SECTIONS: Section[] = [
  { id: 'accounts', label: 'Cuentas Conectadas', icon: Mail, description: 'Estado de conexión OAuth de cada cuenta Gmail' },
  { id: 'oauth', label: 'Estado OAuth', icon: Key, description: 'Tokens, scopes y estado de autenticación' },
  { id: 'space', label: 'Espacio Utilizado', icon: BarChart3, description: 'Almacenamiento usado y recuperable por cuenta' },
  { id: 'spam', label: 'Spam Detectado', icon: AlertTriangle, description: 'Correos clasificados como spam probable' },
  { id: 'promotions', label: 'Promociones', icon: Tag, description: 'Correos promocionales y boletines' },
  { id: 'large-files', label: 'Archivos Grandes', icon: Trash2, description: 'Mensajes con adjuntos >10MB' },
  { id: 'trusted', label: 'Remitentes Seguros', icon: Shield, description: 'Lista blanca de dominios y correos confiables' },
  { id: 'rules', label: 'Reglas Automáticas', icon: Sliders, description: 'Reglas de clasificación y automatización' },
  { id: 'history', label: 'Historial', icon: Clock, description: 'Registro de auditoría de todas las acciones' },
  { id: 'pending', label: 'Acciones Pendientes', icon: RefreshCw, description: 'Limpiezas esperando aprobación del OWNER' },
  { id: 'revoke', label: 'Revocar Acceso', icon: Key, description: 'Revocar conexión OAuth de una cuenta' },
]

export default function EmailCleanerPage() {
  usePageTitle("ELIANA Gmail Cleaner — Admin")
  const router = useRouter()
  const [section, setSection] = useState<SectionId>('accounts')
  const [authorized, setAuthorized] = useState(false)
  const [accounts, setAccounts] = useState<GmailAccount[]>(() => loadAccounts())
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(() => loadAnalysis())
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [pendingActions, setPendingActions] = useState<CleanAction[]>(() => loadPendingActions())
  const [actionLoading, setActionLoading] = useState(false)
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(() => loadAuditEntries())
  const [trustedDomains, setTrustedDomains] = useState<string[]>(() => loadTrustedDomains())
  const [trustedEmails] = useState<string[]>(() => loadTrustedEmails())
  const [classificationRules, setClassificationRules] = useState<ClassificationRule[]>(() => loadClassificationRules())
  const [automation, setAutomation] = useState(() => loadAutomation())

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== 'msmmystore@gmail.com') {
      router.replace('/')
    } else {
      setAuthorized(true)
      loadAuditLog()
    }
  }, [router])

  const loadAuditLog = async () => {
    try {
      const res = await fetch('/api/email-cleaner/audit')
      const data = await res.json()
      if (data.entries) setAuditEntries(data.entries)
    } catch { /* silent */ }
  }

  const handleStatusChange = (id: string, status: GmailAccount['status']) => {
    setAccounts(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status, connectedAt: status === 'CONNECTED' ? new Date().toISOString() : a.connectedAt } : a)
      saveAccounts(next)
      return next
    })
  }

  const handleAnalyze = useCallback(async () => {
    const connected = accounts.find(a => a.status === 'CONNECTED')
    if (!connected) return
    setAnalysisLoading(true)
    try {
      const res = await fetch('/api/email-cleaner/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: connected.id, accountEmail: connected.email }),
      })
      const data = await res.json()
      if (data.analysis) {
        saveAnalysis(data.analysis)
        setAnalysis(data.analysis)
        const actions: CleanAction[] = []
        for (const cat of data.analysis.categories) {
          if (cat.sampleMessages) {
            for (const msg of cat.sampleMessages) {
              actions.push({
                id: `action-${msg.id}`,
                accountId: connected.id,
                category: cat.name,
                gmailMessageId: msg.id,
                gmailThreadId: msg.id,
                subject: msg.subject,
                from: msg.from,
                action: cat.suggestedAction,
                reason: cat.riskLevel === 'high' ? 'Clasificado como alto riesgo' : 'Limpieza preventiva',
                approved: false,
                executed: false,
              })
            }
          }
        }
        savePendingActions(actions)
        setPendingActions(actions)
      }
    } catch { /* ignore */ } finally {
      setAnalysisLoading(false)
    }
  }, [accounts])

  const handleApprove = async (actionIds: string[]) => {
    setActionLoading(true)
    try {
      const session = getSession()
      await fetch('/api/email-cleaner/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accounts.find(a => a.status === 'CONNECTED')?.id,
          actionIds,
          approvedBy: session?.email || 'owner',
        }),
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (actionIds: string[]) => {
    setPendingActions(prev => {
      const next = prev.filter(a => !actionIds.includes(a.id))
      savePendingActions(next)
      return next
    })
    actionIds.forEach(id => {
      const action = pendingActions.find(a => a.id === id)
      if (action) {
        const entry: AuditEntry = {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          accountId: action.accountId,
          emailAccount: action.from,
          action: 'REJECT',
          gmailMessageId: action.gmailMessageId,
          gmailThreadId: action.gmailThreadId,
          category: action.category,
          reason: 'Rechazado por el OWNER',
          approvedBy: getSession()?.email || 'owner',
          approvedAt: new Date().toISOString(),
          executedAt: new Date().toISOString(),
          result: 'SKIPPED',
          correlationId: `corr-${Date.now()}`,
        }
        const entries = loadAuditEntries()
        entries.unshift(entry)
        saveAuditEntries(entries)
        setAuditEntries([...entries])
      }
    })
  }

  const handleExecute = async (actionIds: string[]) => {
    setPendingActions(prev => {
      const next = prev.filter(a => !actionIds.includes(a.id))
      savePendingActions(next)
      return next
    })
    actionIds.forEach(id => {
      const action = pendingActions.find(a => a.id === id)
      if (action) {
        const entry: AuditEntry = {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          accountId: action.accountId,
          emailAccount: action.from,
          action: 'EXECUTE',
          gmailMessageId: action.gmailMessageId,
          gmailThreadId: action.gmailThreadId,
          category: action.category,
          reason: action.reason,
          approvedBy: getSession()?.email || 'owner',
          approvedAt: new Date().toISOString(),
          executedAt: new Date().toISOString(),
          result: 'SUCCESS',
          correlationId: `corr-${Date.now()}`,
        }
        const entries = loadAuditEntries()
        entries.unshift(entry)
        saveAuditEntries(entries)
        setAuditEntries([...entries])
      }
    })
    await loadAuditLog()
  }

  const handleToggleRule = (id: string) => {
    setClassificationRules(prev => {
      const next = prev.map(r => r.id === id ? { ...r, active: !r.active } : r)
      saveClassificationRules(next)
      return next
    })
  }

  const handleDeleteRule = (id: string) => {
    setClassificationRules(prev => {
      const next = prev.filter(r => r.id !== id)
      saveClassificationRules(next)
      return next
    })
  }

  const handleAddTrustedDomain = (domain: string) => {
    setTrustedDomains(prev => {
      const next = [...prev, domain]
      saveTrustedDomains(next)
      return next
    })
  }

  const handleRemoveTrustedDomain = (domain: string) => {
    setTrustedDomains(prev => {
      const next = prev.filter(d => d !== domain)
      saveTrustedDomains(next)
      return next
    })
  }

  if (!authorized) return null

  const connectedAccount = accounts.find(a => a.status === 'CONNECTED')
  const totalRecoverableMB = analysis?.estimatedSpaceMB || 0
  const spamCount = analysis?.categories.find(c => c.name === 'spam')?.messageCount || 0
  const promoCount = analysis?.categories.find(c => c.name === 'promotions')?.messageCount || 0
  const largeCount = analysis?.categories.find(c => c.name === 'large')?.messageCount || 0

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">ELIANA Gmail Cleaner</h1>
            <p className="text-sm text-slate-400">ELIANA organiza y limpia — Don Miguel conserva el control de acceso, códigos de seguridad y aprobación final</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Cuentas', value: accounts.filter(a => a.status === 'CONNECTED').length.toString(), icon: Mail, color: 'text-emerald-400' },
            { label: 'Spam detectado', value: spamCount.toString(), icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Espacio recuperable', value: `~${totalRecoverableMB} MB`, icon: Trash2, color: 'text-amber-400' },
            { label: 'Pendientes', value: pendingActions.length.toString(), icon: RefreshCw, color: 'text-[#00D9FF]' },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1.5`} />
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-8 p-1 rounded-2xl bg-slate-900/60 overflow-x-auto">
          {SECTIONS.map(({ id, label }) => {
            const Icon = SECTIONS.find(s => s.id === id)!.icon
            const hasAlert = id === 'pending' && pendingActions.length > 0
            return (
              <button key={id} onClick={() => setSection(id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all ${
                  section === id ? 'bg-gradient-to-r from-[#00D9FF]/15 to-blue-600/10 text-[#00D9FF] border border-[#00D9FF]/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {label}
                {hasAlert && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse absolute -top-0.5 -right-0.5" />}
              </button>
            )
          })}
        </div>

        <div className="mb-8">
          {section === 'accounts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Cuentas Conectadas</h2>
              {accounts.map(acc => (
                <GmailConnect key={acc.id} account={acc} onStatusChange={handleStatusChange} />
              ))}
              <div className="p-5 rounded-2xl glass border border-slate-800/60">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-emerald-400" /> Flujo de conexión seguro</h3>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Haz clic en <strong className="text-white">Conectar</strong> para iniciar OAuth 2.0 con Google.</li>
                  <li>Google te redirigirá a su página de inicio de sesión.</li>
                  <li><strong className="text-amber-400">Introduce manualmente</strong> tu contraseña y código 2FA — ELIANA nunca los ve ni almacena.</li>
                  <li>Autoriza los permisos mínimos solicitados (solo lectura, modificación de etiquetas, sin envío).</li>
                  <li>Vuelve a ZAFIRO y confirma la conexión.</li>
                </ol>
              </div>
            </div>
          )}

          {section === 'oauth' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Estado OAuth</h2>
              {accounts.map(acc => (
                <GlassCard key={acc.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Key className={`w-5 h-5 ${acc.status === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{acc.email}</p>
                        <p className={`text-xs ${acc.status === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {acc.status === 'CONNECTED' ? 'Token activo' : 'Sin conexión'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {acc.status === 'CONNECTED' && (
                    <div className="text-[10px] text-slate-500 space-y-1">
                      <p><strong>Scopes:</strong> gmail.readonly, gmail.modify, gmail.labels</p>
                      <p><strong>PKCE:</strong> Activado</p>
                      <p><strong>Token:</strong> Almacenado cifrado en servidor</p>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

          {section === 'space' && (
            <AnalysisReport analysis={analysis} onAnalyze={handleAnalyze} loading={analysisLoading} />
          )}

          {(section === 'spam' || section === 'promotions' || section === 'large-files') && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">
                {section === 'spam' ? 'Spam Detectado' : section === 'promotions' ? 'Promociones' : 'Archivos Grandes'}
              </h2>
              {analysis ? (
                <>
                  {analysis.categories.filter(c => 
                    section === 'spam' ? c.name === 'spam' :
                    section === 'promotions' ? c.name === 'promotions' :
                    c.name === 'large'
                  ).map((cat, i) => (
                    <GlassCard key={i} className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-white">{cat.label}</p>
                          <p className="text-[10px] text-slate-500">{cat.messageCount} mensajes · ~{cat.estimatedSpaceMB} MB</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          cat.riskLevel === 'high' ? 'bg-red-500/10 text-red-400' :
                          cat.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>{cat.riskLevel.toUpperCase()}</span>
                      </div>
                      {cat.sampleMessages && cat.sampleMessages.length > 0 ? (
                        <div className="space-y-2">
                          {cat.sampleMessages.map((msg, j) => (
                            <div key={j} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                              <p className="text-xs text-white truncate">{msg.subject}</p>
                              <p className="text-[10px] text-slate-500">{msg.from} · {(msg.sizeKB / 1024).toFixed(1)} MB</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No se encontraron elementos en esta categoría.</p>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </>
              ) : (
                <div className="p-8 rounded-2xl glass text-center">
                  <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Ejecuta un análisis para ver resultados.</p>
                </div>
              )}
            </div>
          )}

          {section === 'trusted' && (
            <ClassificationRules
              rules={classificationRules}
              trustedDomains={trustedDomains}
              trustedEmails={trustedEmails}
              onToggleRule={handleToggleRule}
              onDeleteRule={handleDeleteRule}
              onAddTrustedDomain={handleAddTrustedDomain}
              onRemoveTrustedDomain={handleRemoveTrustedDomain}
            />
          )}

          {section === 'rules' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00D9FF]" /> Reglas de Automatización
              </h2>
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-white">Automatización</p>
                    <p className="text-[10px] text-slate-500">Permite a ELIANA ejecutar acciones programadas</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${automation.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {automation.enabled ? 'ACTIVADA' : 'DESACTIVADA'}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'analyzeSpam', label: 'Analizar spam diariamente' },
                    { key: 'labelPromotions', label: 'Etiquetar promociones' },
                    { key: 'archiveOld', label: 'Archivar correos antiguos' },
                    { key: 'alertLargeFiles', label: 'Alertar por archivos grandes' },
                    { key: 'alertPhishing', label: 'Alertar por posible phishing' },
                    { key: 'weeklyReport', label: 'Generar reporte semanal' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-2">
                      <span className="text-xs text-slate-300">{label}</span>
                      <input type="checkbox" defaultChecked={automation.actions[key as keyof typeof automation.actions]}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#00D9FF] focus:ring-[#00D9FF]/30" />
                    </div>
                  ))}
                </div>
              </GlassCard>
              <div className="p-4 rounded-2xl glass border border-amber-500/20 bg-amber-500/5">
                <p className="text-[10px] text-amber-400">
                  ⚠️ La automatización <strong className="text-white">nunca</strong> borra permanentemente sin aprobación del OWNER. 
                  ELIANA solo etiqueta, archiva y alerta en automático. La eliminación definitiva siempre requiere tu aprobación.
                </p>
              </div>
            </div>
          )}

          {section === 'history' && (
            <AuditLog entries={auditEntries} />
          )}

          {section === 'pending' && (
            <ActionPanel
              pendingActions={pendingActions}
              onApprove={handleApprove}
              onReject={handleReject}
              onExecute={handleExecute}
              loading={actionLoading}
            />
          )}

          {section === 'revoke' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-red-400" /> Revocar Acceso
              </h2>
              {accounts.filter(a => a.status === 'CONNECTED').length === 0 ? (
                <GlassCard className="p-5 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No hay cuentas conectadas actualmente.</p>
                </GlassCard>
              ) : (
                accounts.filter(a => a.status === 'CONNECTED').map(acc => (
                  <GlassCard key={acc.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{acc.email}</p>
                          <p className="text-[10px] text-slate-500">Conectado — Revocar eliminará el token OAuth</p>
                        </div>
                      </div>
                      <button onClick={() => handleStatusChange(acc.id, 'DISCONNECTED')}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all">
                        Revocar
                      </button>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          )}

          {section === 'automation' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Automatización</h2>
              <GlassCard className="p-5">
                <p className="text-xs text-slate-500">Reglas automáticas configuradas desde la sección <strong className="text-[#00D9FF] cursor-pointer" onClick={() => setSection('rules')}>Reglas Automáticas</strong>.</p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
