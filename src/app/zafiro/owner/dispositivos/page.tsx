'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { isOwnerEmail } from '@/lib/owner'
import { getSession } from '@/lib/auth'
import {
  registerCurrentDevice, getOwnerDevices, trustDevice, revokeDevice,
  getDeviceEvents, getSyncPreferences, saveSyncPreferences, syncNow,
  type OwnerDevice, type DeviceSyncEvent, type SyncPreferences,
} from '@/lib/owner-devices'
import {
  ArrowLeft, Smartphone, Monitor, Shield, ShieldCheck, ShieldOff,
  RefreshCw,
} from 'lucide-react'

function DeviceIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'android': case 'ios': return <Smartphone className="w-5 h-5" />
    default: return <Monitor className="w-5 h-5" />
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    TRUSTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    REVOKED: 'bg-red-500/10 text-red-400 border-red-500/20',
    BLOCKED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  )
}

export default function OwnerDispositivosPage() {
  usePageTitle('Mis Dispositivos — ZAFIRO')
  const [devices, setDevices] = useState<OwnerDevice[]>([])
  const [events, setEvents] = useState<Record<string, DeviceSyncEvent[]>>({})
  const [syncPrefs, setSyncPrefs] = useState<SyncPreferences>(getSyncPreferences())
  const [syncResult, setSyncResult] = useState<{ synced: string[]; timestamp: string } | null>(null)
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null)
  const [authorized] = useState(() => {
    const session = getSession()
    return !!(session && isOwnerEmail(session.email))
  })

  useEffect(() => {
    const device = registerCurrentDevice()
    const d = getOwnerDevices()
    setDevices(d)
    if (device) {
      setEvents(prev => ({ ...prev, [device.id]: getDeviceEvents(device.id) }))
    }
  }, [])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <ShieldOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo el OWNER_SUPERADMIN puede acceder a esta sección.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver a ZAFIRO</Link>
        </div>
      </div>
    )
  }

  const handleTrust = (id: string) => {
    trustDevice(id)
    setDevices(getOwnerDevices())
  }

  const handleRevoke = (id: string) => {
    revokeDevice(id)
    setDevices(getOwnerDevices())
  }

  const handleSync = () => {
    const result = syncNow()
    setSyncResult(result)
    setDevices(getOwnerDevices())
  }

  const toggleDevice = (id: string) => {
    setExpandedDevice(expandedDevice === id ? null : id)
    if (!events[id]) {
      setEvents({ ...events, [id]: getDeviceEvents(id) })
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20">
            <Shield className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Mis Dispositivos</h1>
            <p className="text-xs text-slate-400">Gestiona tus dispositivos autorizados — Frecuencia 369-777</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl glass">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-bold">Dispositivos</span>
            </div>
            <p className="text-2xl font-black">{devices.length}</p>
            <p className="text-[10px] text-slate-500">{devices.filter(d => d.status === 'TRUSTED').length} confiados</p>
          </div>
          <div className="p-4 rounded-2xl glass">
            <div className="flex items-center gap-2 text-[#00D9FF] mb-1">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs font-bold">Sincronización</span>
            </div>
            <p className="text-2xl font-black">{syncPrefs.syncIntervalMinutes}min</p>
            <p className="text-[10px] text-slate-500">Intervalo de sincronización</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={handleSync}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Sincronizar Ahora
          </button>
        </div>

        {syncResult && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            Sincronizado: {syncResult.synced.join(', ')} — {new Date(syncResult.timestamp).toLocaleString()}
          </div>
        )}

        <div className="space-y-3 mb-8">
          <h2 className="text-sm font-bold text-slate-300">Dispositivos Registrados</h2>
          {devices.length === 0 && (
            <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
              No hay dispositivos registrados. Al cargar esta página, tu dispositivo actual se registra automáticamente.
            </div>
          )}
          {devices.map(d => (
            <div key={d.id} className="rounded-2xl glass overflow-hidden">
              <button onClick={() => toggleDevice(d.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-[#0B1220]/60 transition-all cursor-pointer text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    d.status === 'TRUSTED' ? 'bg-emerald-500/10' :
                    d.status === 'PENDING' ? 'bg-amber-500/10' : 'bg-red-500/10'
                  }`}>
                    <DeviceIcon platform={d.platform} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{d.deviceName}</h3>
                    <p className="text-[10px] text-slate-500">
                      {d.platform} · {d.browser} · {d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleDateString() : 'Nuevo'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={d.status} />
                  {d.status === 'PENDING' && (
                    <button onClick={(e) => { e.stopPropagation(); handleTrust(d.id) }}
                      className="text-emerald-400 hover:text-emerald-300 cursor-pointer" title="Confiar dispositivo">
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                  {d.status !== 'REVOKED' && d.status !== 'BLOCKED' && (
                    <button onClick={(e) => { e.stopPropagation(); handleRevoke(d.id) }}
                      className="text-red-400 hover:text-red-300 cursor-pointer" title="Revocar dispositivo">
                      <ShieldOff className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </button>
              {expandedDevice === d.id && (
                <div className="px-4 pb-4 border-t border-slate-800/50 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Eventos</h4>
                  {(events[d.id] || []).length === 0 && (
                    <p className="text-[10px] text-slate-600">Sin eventos registrados</p>
                  )}
                  {(events[d.id] || []).slice(-5).reverse().map(e => (
                    <div key={e.id} className="flex items-center gap-2 py-1 text-[10px] text-slate-500">
                      <span className="text-[#00D9FF]">{e.eventType}</span>
                      <span className="text-slate-700">·</span>
                      <span>{new Date(e.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl glass">
          <h2 className="text-sm font-bold text-slate-300 mb-4">Preferencias de Sincronización</h2>
          <div className="space-y-3 max-w-md">
            {[
              { key: 'syncEliana' as const, label: 'Sincronizar ELIANA' },
              { key: 'syncKnowledge' as const, label: 'Sincronizar Conocimiento' },
              { key: 'syncProjects' as const, label: 'Sincronizar Proyectos' },
              { key: 'syncNotifications' as const, label: 'Sincronizar Notificaciones' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-400">{label}</span>
                <input type="checkbox" checked={syncPrefs[key]}
                  onChange={() => {
                    const next = { ...syncPrefs, [key]: !syncPrefs[key] }
                    setSyncPrefs(next)
                    saveSyncPreferences(next)
                  }}
                  className="accent-[#00D9FF]" />
              </label>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Intervalo (minutos)</span>
              <select value={syncPrefs.syncIntervalMinutes}
                onChange={(e) => {
                  const next = { ...syncPrefs, syncIntervalMinutes: parseInt(e.target.value) }
                  setSyncPrefs(next)
                  saveSyncPreferences(next)
                }}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-white px-2 py-1">
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
