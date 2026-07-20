'use client'

import { useState, useEffect } from 'react'
import { getSyncStatus, retryAllFailed, clearConfirmed, cleanupOldOperations } from '@/lib/offline-queue'
import { processQueue } from '@/lib/sync-engine'
import { RefreshCw, CloudOff, Cloud, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export function SyncStatusIndicator() {
  const [status, setStatus] = useState(() => getSyncStatus())
  const [syncing, setSyncing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setStatus(getSyncStatus()), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setStatus(getSyncStatus())
      if (getSyncStatus().pendingCount > 0) handleSync()
    }
    const handleOffline = () => setStatus(getSyncStatus())
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    await processQueue()
    setStatus(getSyncStatus())
    setSyncing(false)
  }

  if (status.queueLength === 0 && status.isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium backdrop-blur-md border transition-all cursor-pointer ${
          status.failedCount > 0
            ? 'bg-red-500/20 border-red-500/30 text-red-400'
            : status.pendingCount > 0
              ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
        }`}>
        {!status.isOnline ? <CloudOff className="w-3.5 h-3.5" />
          : syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          : status.failedCount > 0 ? <AlertTriangle className="w-3.5 h-3.5" />
          : status.pendingCount > 0 ? <Clock className="w-3.5 h-3.5" />
          : <Cloud className="w-3.5 h-3.5" />}
        {!status.isOnline ? 'Offline'
          : syncing ? 'Sincronizando...'
          : status.failedCount > 0 ? `${status.failedCount} fallaron`
          : status.pendingCount > 0 ? `${status.pendingCount} pendientes`
          : 'Sin cambios pendientes'}
      </button>

      {expanded && (
        <div className="absolute bottom-12 right-0 w-72 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 shadow-xl space-y-2">
          <p className="text-[10px] font-bold text-slate-300">Estado de Sincronización</p>
          <div className="space-y-1 text-[9px] text-slate-400">
            <div className="flex justify-between"><span>Cola total</span><span>{status.queueLength}</span></div>
            <div className="flex justify-between"><span>Pendientes</span><span className="text-amber-400">{status.pendingCount}</span></div>
            <div className="flex justify-between"><span>Fallados</span><span className="text-red-400">{status.failedCount}</span></div>
            <div className="flex justify-between"><span>Confirmados</span><span className="text-emerald-400">{status.confirmedCount}</span></div>
            <div className="flex justify-between"><span>Online</span><span className={status.isOnline ? 'text-emerald-400' : 'text-red-400'}>{status.isOnline ? 'Sí' : 'No'}</span></div>
            {status.lastSyncTime && (
              <div className="flex justify-between"><span>Última sinc.</span><span>{new Date(status.lastSyncTime).toLocaleTimeString()}</span></div>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            {status.pendingCount > 0 && (
              <button onClick={handleSync} disabled={syncing}
                className="flex-1 px-2 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] text-[9px] font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30 transition-colors">
                {syncing ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
            )}
            {status.failedCount > 0 && (
              <button onClick={() => { retryAllFailed(); handleSync() }}
                className="flex-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[9px] font-medium hover:bg-amber-500/20 transition-colors">
                Reintentar
              </button>
            )}
            {status.confirmedCount > 0 && (
              <button onClick={() => { clearConfirmed(); cleanupOldOperations(); setStatus(getSyncStatus()) }}
                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[9px] font-medium hover:bg-slate-700 transition-colors">
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
