'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { isOwnerEmail } from '@/lib/owner'
import { useRouter } from 'next/navigation'
import {
  getSyncStatus, getPendingItems, getFailedItems, getConfirmedItems,
  retryAllFailed, clearConfirmed, cleanupOldOperations,
} from '@/lib/offline-queue'
import { processQueue, getSyncEngineStatus, registerSyncHandler, unregisterSyncHandler } from '@/lib/sync-engine'
import { RefreshCw, Cloud, CloudOff, AlertTriangle, CheckCircle, Clock, Trash2, ChevronLeft } from 'lucide-react'

export default function AdminSyncPage() {
  usePageTitle('Sincronización — Admin ZAFIRO')
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [status, setStatus] = useState(() => getSyncEngineStatus())
  const [syncing, setSyncing] = useState(false)
  const [tab, setTab] = useState<'status' | 'pending' | 'failed' | 'confirmed'>('status')

  useEffect(() => {
    if (!session) { router.replace('/auth/login'); return }
    if (!isOwnerEmail(session.email)) { setAuthorized(false); return }
    setAuthorized(true)
  }, [session, router])

  const refresh = () => setStatus(getSyncEngineStatus())

  const handleSync = async () => {
    setSyncing(true)
    await processQueue((current, total) => { refresh() })
    refresh()
    setSyncing(false)
  }

  if (authorized === false) return <div className="min-h-screen bg-[#050816] text-white p-4 text-slate-400 text-sm">No autorizado</div>
  if (authorized === null) return null

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-4 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Panel Admin
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Motor de Sincronización</h1>
            <p className="text-xs text-slate-400">Offline-First Queue Manager</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-400">{status.pendingCount}</p>
            <p className="text-[10px] text-slate-400">Pendientes</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <AlertTriangle className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-400">{status.failedCount}</p>
            <p className="text-[10px] text-slate-400">Fallados</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400">{status.confirmedCount}</p>
            <p className="text-[10px] text-slate-400">Confirmados</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            {status.isOnline ? <Cloud className="w-4 h-4 text-[#00D9FF] mx-auto mb-1" /> : <CloudOff className="w-4 h-4 text-slate-500 mx-auto mb-1" />}
            <p className={`text-lg font-bold ${status.isOnline ? 'text-[#00D9FF]' : 'text-slate-500'}`}>{status.isOnline ? 'Online' : 'Offline'}</p>
            <p className="text-[10px] text-slate-400">{status.registeredHandlers.length} handlers</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={handleSync} disabled={syncing || status.pendingCount === 0}
            className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Sincronizando...' : 'Sincronizar todo'}
          </button>
          {status.failedCount > 0 && (
            <button onClick={() => { retryAllFailed(); handleSync() }}
              className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-colors">
              Reintentar fallados
            </button>
          )}
          {status.confirmedCount > 0 && (
            <button onClick={() => { clearConfirmed(); cleanupOldOperations(); refresh() }}
              className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
              <Trash2 className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4 border-b border-[#1A1B3A] pb-2">
          {(['status', 'pending', 'failed', 'confirmed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-400 hover:text-white'}`}>
              {t === 'status' ? 'Info' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'status' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-xs space-y-2 text-slate-400">
            <p><span className="text-slate-500">Handlers registrados:</span> {status.registeredHandlers.join(', ') || 'Ninguno'}</p>
            <p><span className="text-slate-500">Última sincronización:</span> {status.lastSyncTime ? new Date(status.lastSyncTime).toLocaleString() : 'Nunca'}</p>
            <p><span className="text-slate-500">Estado de red:</span> {status.isOnline ? 'Online' : 'Offline'}</p>
            <p className="text-[9px] text-slate-600 mt-2">Las operaciones se encolan localmente y se sincronizan cuando hay conexión. Ideal para entornos con conectividad intermitente (Cuba, 2G, etc.).</p>
          </div>
        )}

        {tab === 'pending' && <ItemsTable title="Pendientes" items={getPendingItems()} />}
        {tab === 'failed' && <ItemsTable title="Fallados" items={getFailedItems()} />}
        {tab === 'confirmed' && <ItemsTable title="Confirmados" items={getConfirmedItems()} />}
      </div>
    </div>
  )
}

function ItemsTable({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-300 mb-3">{title} ({items.length})</p>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">No hay operaciones {title.toLowerCase()}</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-2.5 text-[9px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-300">{item.type.toUpperCase()} — {item.entity}</span>
                <span className="text-slate-500">{item.id.slice(0, 12)}</span>
              </div>
              <p className="text-slate-500 truncate">{item.entityId}</p>
              {item.error && <p className="text-red-400 mt-0.5">Error: {item.error}</p>}
              <p className="text-slate-600 mt-0.5">Intentos: {item.retryCount}/{item.maxRetries} · {new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
