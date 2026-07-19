'use client'

import { useState, useEffect } from "react"
import { WifiOff, Wifi, RefreshCw, CloudOff, CheckCircle } from "lucide-react"
import { getNetworkMode, onNetworkModeChange } from "@/lib/performance/network-mode"
import type { ZafiroNetworkMode } from "@/lib/performance/network-mode"
import { getPendingOperations, processSyncQueue, getSyncStats } from "@/lib/performance/sync-engine"

export default function OfflineStatus() {
  const [mode, setMode] = useState<ZafiroNetworkMode>('FULL')
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<{ synced: number; failed: number } | null>(null)

  useEffect(() => {
    setMode(getNetworkMode())
    const unsub = onNetworkModeChange(m => setMode(m))
    return unsub
  }, [])

  const stats = getSyncStats()

  const handleSync = async () => {
    setSyncing(true)
    const r = await processSyncQueue(async (op) => {
      await new Promise(r => setTimeout(r, 300))
      return true
    })
    setResult(r)
    setSyncing(false)
    setTimeout(() => setResult(null), 5000)
  }

  if (mode === 'FULL' || mode === 'BALANCED') return null

  return (
    <div className={`fixed bottom-6 left-6 z-50 max-w-[300px] rounded-2xl p-3 border shadow-xl ${
      mode === 'OFFLINE' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900/95 border-slate-700/60'
    }`}>
      <div className="flex items-start gap-2">
        {mode === 'OFFLINE' ? (
          <WifiOff className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        ) : (
          <CloudOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-medium ${mode === 'OFFLINE' ? 'text-red-400' : 'text-amber-400'}`}>
            {mode === 'OFFLINE' ? 'Sin conexión' : 'Modo ahorro de datos'}
          </p>
          <p className="text-[9px] text-slate-500 mt-0.5">
            {stats.pending > 0 ? `${stats.pending} operaciones pendientes` : 'Todo sincronizado'}
          </p>

          {result && (
            <div className="flex items-center gap-1 mt-1">
              {result.synced > 0 && <CheckCircle className="w-3 h-3 text-emerald-400" />}
              <span className="text-[9px] text-slate-500">
                {result.synced > 0 && `${result.synced} sincronizados`}
                {result.failed > 0 && ` · ${result.failed} fallaron`}
              </span>
            </div>
          )}

          {stats.pending > 0 && (
            <button onClick={handleSync} disabled={syncing || mode === 'OFFLINE'}
              className="flex items-center gap-1 mt-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[9px] text-white transition-all disabled:opacity-50">
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
