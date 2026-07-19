'use client'

import type { ZafiroNetworkMode, ConnectionType } from './network-mode'

export interface ConnectionSample {
  timestamp: string
  mode: ZafiroNetworkMode
  connectionType: ConnectionType
  downlink: number
  rtt: number
  online: boolean
  saveData: boolean
}

export interface ConnectionReport {
  samples: ConnectionSample[]
  averageDownlink: number
  averageRtt: number
  uptime: number
  downtime: number
  modeDistribution: Record<string, number>
}

const STORAGE_KEY = 'zafiro_connection_samples'
const MAX_SAMPLES = 500

export function recordSample(): ConnectionSample {
  const nav = navigator as any
  const conn = nav.connection
  const sample: ConnectionSample = {
    timestamp: new Date().toISOString(),
    mode: (typeof window !== 'undefined' ? (nav.connection?.effectiveType === '4g' ? 'FULL' : nav.connection?.effectiveType === '3g' ? 'BALANCED' : 'LIGHT') : 'FULL') as ZafiroNetworkMode,
    connectionType: (conn?.effectiveType || 'unknown') as ConnectionType,
    downlink: conn?.downlink || 0,
    rtt: conn?.rtt || 0,
    online: navigator.onLine,
    saveData: conn?.saveData || false,
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const samples: ConnectionSample[] = raw ? JSON.parse(raw) : []
    samples.push(sample)
    if (samples.length > MAX_SAMPLES) samples.splice(0, samples.length - MAX_SAMPLES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples))
  } catch { /* silent */ }

  return sample
}

export function getConnectionHistory(): ConnectionSample[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function generateConnectionReport(): ConnectionReport {
  const samples = getConnectionHistory()
  if (samples.length === 0) {
    return { samples: [], averageDownlink: 0, averageRtt: 0, uptime: 0, downtime: 0, modeDistribution: {} }
  }

  const totalDownlink = samples.reduce((a, c) => a + c.downlink, 0)
  const totalRtt = samples.reduce((a, c) => a + c.rtt, 0)
  const onlineCount = samples.filter(s => s.online).length
  const modeDistribution: Record<string, number> = {}
  samples.forEach(s => {
    modeDistribution[s.mode] = (modeDistribution[s.mode] || 0) + 1
  })

  return {
    samples: samples.slice(-100),
    averageDownlink: samples.length > 0 ? parseFloat((totalDownlink / samples.length).toFixed(2)) : 0,
    averageRtt: samples.length > 0 ? Math.round(totalRtt / samples.length) : 0,
    uptime: samples.length > 0 ? parseFloat(((onlineCount / samples.length) * 100).toFixed(1)) : 0,
    downtime: samples.length > 0 ? parseFloat((((samples.length - onlineCount) / samples.length) * 100).toFixed(1)) : 0,
    modeDistribution,
  }
}

export function clearConnectionHistory(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* silent */ }
}

export function startAutoSampling(intervalMs = 30000): () => void {
  recordSample()
  const id = setInterval(recordSample, intervalMs)
  return () => clearInterval(id)
}
