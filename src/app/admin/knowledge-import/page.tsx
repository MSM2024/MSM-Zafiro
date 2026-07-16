"use client"

import { useState, useRef } from "react"
import { importKnowledgeEntries, getKnowledgeBase, approveKnowledgeEntry, rejectKnowledgeEntry, deleteKnowledgeEntry } from "@/lib/import-whatsapp-knowledge"
import { detectConflicts } from "@/lib/conflict-detector"
import type { KnowledgeEntry, KnowledgeImportResult } from "@/config/knowledge-schema"
import { MoveLeft, Check, X, Trash2, AlertTriangle, Upload, FileText, Search } from "lucide-react"

export default function KnowledgeImportPage() {
  const [result, setResult] = useState<KnowledgeImportResult | null>(null)
  const [entries, setEntries] = useState<KnowledgeEntry[]>(getKnowledgeBase)
  const [tab, setTab] = useState<"import" | "manage" | "audit">("import")
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")
  const [conflictReport, setConflictReport] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = () => {
    setError("")
    setConflictReport(null)
    try {
      const parsed = JSON.parse(jsonInput)
      const data = Array.isArray(parsed) ? parsed : [parsed]
      const report = detectConflicts(data)
      setConflictReport(report)
      if (report.summary.riskLevel === "critical") {
        setError("⚠️ CRITICAL: Secrets detected. Import blocked.")
        return
      }
      const res = importKnowledgeEntries(data)
      setResult(res)
      setEntries(getKnowledgeBase())
      if (res.imported > 0) setJsonInput("")
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setJsonInput(ev.target?.result as string)
    reader.readAsText(file)
  }

  const handleApprove = (id: string) => {
    approveKnowledgeEntry(id)
    setEntries(getKnowledgeBase())
  }

  const handleReject = (id: string) => {
    rejectKnowledgeEntry(id)
    setEntries(getKnowledgeBase())
  }

  const handleDelete = (id: string) => {
    deleteKnowledgeEntry(id)
    setEntries(getKnowledgeBase())
  }

  const pendingCount = entries.filter((e) => e.status === "PENDING_REVIEW").length

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-[#00D9FF]" />
          <h1 className="text-xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
              Knowledge Import Center
            </span>
          </h1>
          {pendingCount > 0 && (
            <span className="ml-auto px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {pendingCount} pending review
            </span>
          )}
        </div>

        <div className="flex gap-1 mb-6 bg-slate-900/50 rounded-xl p-1 border border-slate-800/50 w-fit">
          {(["import", "manage", "audit"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${tab === t ? "bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30" : "text-slate-400 hover:text-white"}`}>
              {t === "import" ? "📥 Import" : t === "manage" ? "📋 Manage" : "🔍 Audit"}
            </button>
          ))}
        </div>

        {tab === "import" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30">
              <label className="text-sm font-bold text-slate-300 mb-2 block">Paste JSON knowledge array</label>
              <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-48 bg-[#050816] border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-300 focus:border-[#00D9FF]/50 transition-colors outline-none resize-y"
                placeholder='[{"id":"doc_1","category":"remesas","title":"Protocolo de Envio","content":"...","source":"whatsapp","tags":["remesas","protocolo"],"priority":"high"}]' />
              <div className="flex gap-2 mt-3">
                <button onClick={handleImport}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Import & Validate
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all">
                  Upload JSON file
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {conflictReport && (
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-400" /> Conflict Detection Report
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                    <span className="text-lg font-black text-white">{conflictReport.summary.totalDuplicates}</span>
                    <p className="text-[10px] text-slate-400">Duplicates</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                    <span className="text-lg font-black text-white">{conflictReport.summary.totalNearDuplicates}</span>
                    <p className="text-[10px] text-slate-400">Near-duplicates</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                    <span className={`text-lg font-black ${conflictReport.summary.totalSecrets > 0 ? "text-red-400" : "text-white"}`}>{conflictReport.summary.totalSecrets}</span>
                    <p className="text-[10px] text-slate-400">Secrets</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                    <span className={`text-lg font-black ${conflictReport.summary.riskLevel === "critical" ? "text-red-400" : conflictReport.summary.riskLevel === "high" ? "text-amber-400" : "text-emerald-400"}`}>{conflictReport.summary.riskLevel}</span>
                    <p className="text-[10px] text-slate-400">Risk Level</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30">
                <h3 className="text-sm font-bold text-slate-300 mb-3">Import Result</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-lg font-black text-emerald-400">{result.imported}</span>
                    <p className="text-[10px] text-slate-400">Imported</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="text-lg font-black text-amber-400">{result.skipped}</span>
                    <p className="text-[10px] text-slate-400">Skipped</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <span className="text-lg font-black text-red-400">{result.failed}</span>
                    <p className="text-[10px] text-slate-400">Failed</p>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                    {result.errors.map((err, i) => (
                      <p key={i} className="text-[10px] font-mono text-red-400/80">• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "manage" && (
          <div className="space-y-2">
            {entries.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No knowledge entries yet. Import some JSON first.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{entry.title}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${entry.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : entry.status === "PENDING_REVIEW" ? "bg-amber-500/20 text-amber-400" : entry.status === "REJECTED" ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}`}>{entry.status}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${entry.priority === "critical" ? "bg-red-500/20 text-red-400" : entry.priority === "high" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>{entry.priority}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{entry.category} · {entry.source}</p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{entry.content.substring(0, 200)}</p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {entry.tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[7px] font-mono">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {entry.status === "PENDING_REVIEW" && (
                        <>
                          <button onClick={() => handleApprove(entry.id)} className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleReject(entry.id)} className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all" title="Reject"><X className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                      <button onClick={() => handleDelete(entry.id)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "audit" && (
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Knowledge Base Audit</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-lg font-black text-white">{entries.length}</span>
                <p className="text-[10px] text-slate-400">Total entries</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-lg font-black text-emerald-400">{entries.filter((e) => e.status === "ACTIVE").length}</span>
                <p className="text-[10px] text-slate-400">Active</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-lg font-black text-amber-400">{entries.filter((e) => e.status === "PENDING_REVIEW").length}</span>
                <p className="text-[10px] text-slate-400">Pending review</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50">
                <span className="text-lg font-black text-red-400">{entries.filter((e) => e.status === "REJECTED").length}</span>
                <p className="text-[10px] text-slate-400">Rejected</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 font-mono">Storage: localStorage (zafiro_knowledge_base)</p>
              <p className="text-[10px] text-slate-500 font-mono">Protocol: Append-only import · Secret scanning · Dedup by ID/title/hash</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
