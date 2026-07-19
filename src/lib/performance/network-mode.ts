'use client'

export type ZafiroNetworkMode = 'LIGHT' | 'BALANCED' | 'FULL' | 'OFFLINE'

export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'ethernet' | 'unknown'

export type ManualMode = 'auto' | 'light' | 'full'

interface NetworkProfile {
  mode: ZafiroNetworkMode
  connectionType: ConnectionType
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

const STORAGE_KEY = 'zafiro_network_mode_preference'

function detectConnectionType(nav: { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }): ConnectionType {
  const conn = nav.connection
  if (!conn) return 'unknown'
  const et = conn.effectiveType || 'unknown'
  if (et === 'slow-2g') return 'slow-2g'
  if (et === '2g') return '2g'
  if (et === '3g') return '3g'
  if (et === '4g') return '4g'
  return 'unknown'
}

function inferMode(connectionType: ConnectionType, saveData: boolean): ZafiroNetworkMode {
  if (!navigator.onLine) return 'OFFLINE'
  if (saveData) return 'LIGHT'
  if (connectionType === 'slow-2g' || connectionType === '2g') return 'LIGHT'
  if (connectionType === '3g') return 'BALANCED'
  return 'FULL'
}

let currentListeners: Array<(mode: ZafiroNetworkMode) => void> = []

export function getManualPreference(): ManualMode {
  if (typeof window === 'undefined') return 'auto'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'full') return raw
    return 'auto'
  } catch { return 'auto' }
}

export function setManualPreference(mode: ManualMode): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch { /* silent */ }
}

export function getNetworkProfile(): NetworkProfile {
  const nav = navigator as any
  const conn = nav.connection as { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } | undefined
  const connectionType = detectConnectionType(nav)
  const saveData = conn?.saveData || false
  const autoMode = inferMode(connectionType, saveData)
  const manual = getManualPreference()
  const mode: ZafiroNetworkMode = manual === 'light' ? 'LIGHT' : manual === 'full' ? 'FULL' : autoMode

  return {
    mode,
    connectionType,
    effectiveType: conn?.effectiveType || 'unknown',
    downlink: conn?.downlink || 0,
    rtt: conn?.rtt || 0,
    saveData,
  }
}

export function getNetworkMode(): ZafiroNetworkMode {
  return getNetworkProfile().mode
}

export function onNetworkModeChange(listener: (mode: ZafiroNetworkMode) => void): () => void {
  currentListeners.push(listener)
  return () => {
    currentListeners = currentListeners.filter(l => l !== listener)
  }
}

function notifyListeners(mode: ZafiroNetworkMode): void {
  currentListeners.forEach(l => l(mode))
}

if (typeof window !== 'undefined') {
  const nav = navigator as any
  const conn = nav.connection
  if (conn) {
    conn.addEventListener('change', () => {
      const profile = getNetworkProfile()
      notifyListeners(profile.mode)
    })
  }
  window.addEventListener('online', () => notifyListeners(getNetworkMode()))
  window.addEventListener('offline', () => notifyListeners('OFFLINE'))
}

export const MODE_CONFIG: Record<ZafiroNetworkMode, {
  label: string
  description: string
  images: 'full' | 'compressed' | 'minimal'
  animations: 'full' | 'reduced' | 'minimal'
  eliana: 'full' | 'text' | 'offline'
  holo: 'full' | 'light' | 'disabled'
  video: 'autoplay' | 'click' | 'disabled'
  preload: 'aggressive' | 'selective' | 'minimal'
  sync: 'realtime' | 'batch' | 'queue'
  pageSize: number
}> = {
  LIGHT: {
    label: 'Ahorro de Datos',
    description: 'Texto primero, imágenes comprimidas, animaciones mínimas',
    images: 'compressed', animations: 'minimal', eliana: 'text',
    holo: 'disabled', video: 'click', preload: 'minimal',
    sync: 'queue', pageSize: 12,
  },
  BALANCED: {
    label: 'Equilibrado',
    description: 'Imágenes optimizadas, animaciones ligeras, precarga selectiva',
    images: 'compressed', animations: 'reduced', eliana: 'text',
    holo: 'light', video: 'click', preload: 'selective',
    sync: 'batch', pageSize: 24,
  },
  FULL: {
    label: 'Completo',
    description: 'Experiencia visual completa, 3D bajo solicitud, precarga inteligente',
    images: 'full', animations: 'full', eliana: 'full',
    holo: 'full', video: 'autoplay', preload: 'aggressive',
    sync: 'realtime', pageSize: 48,
  },
  OFFLINE: {
    label: 'Sin Conexión',
    description: 'Contenido guardado, operaciones en cola, sincronización posterior',
    images: 'minimal', animations: 'minimal', eliana: 'offline',
    holo: 'disabled', video: 'disabled', preload: 'minimal',
    sync: 'queue', pageSize: 12,
  },
}
