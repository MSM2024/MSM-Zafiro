'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getStorageSummary, downloadBackup, restoreBackup, clearAllZafiroData, type RestoreResult } from "@/lib/backup-restore"
import { Database, Download, Upload, Trash2, AlertTriangle, CheckCircle2, FileJson, RefreshCw, HardDrive } from "lucide-react"

export default function AdminDatosPage() {
  usePageTitle("Gestión de Datos — Admin ZAFIRO")
  const [summary, setSummary] = useState(() => getStorageSummary())
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = () => setSummary(getStorageSummary())

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const result = await restoreBackup(file)
    setRestoreResult(result)
    setImporting(false)
    refresh()
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleClear = () => {
    const count = clearAllZafiroData()
    setConfirmClear(false)
    refresh()
    setRestoreResult({ success: true, keysRestored: 0, keysSkipped: [], error: undefined })
    setTimeout(() => setRestoreResult(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-[#00D9FF] bg-clip-text text-transparent">
              Gestión de Datos
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Backup, restauración y almacenamiento local</p>
          </div>
          <button onClick={refresh} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Storage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
            <HardDrive className="w-5 h-5 text-[#00D9FF] mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{summary.totalKeys}</p>
            <p className="text-[10px] text-slate-500">Claves almacenadas</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
            <FileJson className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{(summary.totalBytes / 1024).toFixed(1)} KB</p>
            <p className="text-[10px] text-slate-500">Tamaño total</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
            <Database className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">localStorage</p>
            <p className="text-[10px] text-slate-500">Almacenamiento</p>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Backup */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-[#00D9FF]" />
              <h2 className="text-sm font-bold text-white">Descargar Backup</h2>
            </div>
            <p className="text-[10px] text-slate-500 mb-4">
              Exporta todos los datos de ZAFIRO (perfiles, productos, ledger, sellos, etc.) a un archivo JSON.
            </p>
            <button onClick={downloadBackup}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-medium text-[#00D9FF] hover:bg-[#00D9FF]/30 transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Descargar Backup Completo
            </button>
          </motion.div>

          {/* Restore */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Restaurar Backup</h2>
            </div>
            <p className="text-[10px] text-slate-500 mb-4">
              Restaura un backup previo. Esto sobrescribirá los datos actuales.
            </p>
            <input ref={fileRef} type="file" accept=".json" onChange={handleRestore} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={importing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400/20 border border-amber-400/30 text-xs font-medium text-amber-400 hover:bg-amber-400/30 transition-all cursor-pointer disabled:opacity-50">
              <Upload className="w-3.5 h-3.5" /> {importing ? "Importando..." : "Seleccionar archivo JSON"}
            </button>
          </motion.div>
        </div>

        {/* Restore Result */}
        {restoreResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              restoreResult.success ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"
            }`}>
            <div className="flex items-center gap-2">
              {restoreResult.success
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                : <AlertTriangle className="w-4 h-4 text-red-400" />
              }
              <p className="text-xs font-medium text-white">
                {restoreResult.error
                  ? `Error: ${restoreResult.error}`
                  : `${restoreResult.keysRestored} claves restauradas exitosamente`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Data Details */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" /> Claves en almacenamiento
          </h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {summary.details.map(d => (
              <div key={d.key} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-800/30 text-[9px]">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shrink-0" />
                  <span className="font-mono text-slate-300 truncate">{d.key}</span>
                </div>
                <span className="text-slate-500 shrink-0 ml-2">{(d.bytes / 1024).toFixed(2)} KB</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Clear Data */}
        <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold text-red-400">Zona de Peligro</h2>
          </div>
          <p className="text-[10px] text-slate-500 mb-4">
            Esto eliminará TODOS los datos locales de ZAFIRO. Asegúrate de tener un backup antes de continuar.
          </p>
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-all cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Limpiar todos los datos
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-xs text-red-300">¿Estás seguro? Esta acción no se puede deshacer.</p>
              <button onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all cursor-pointer">
                Sí, eliminar todo
              </button>
              <button onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white transition-all cursor-pointer">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
