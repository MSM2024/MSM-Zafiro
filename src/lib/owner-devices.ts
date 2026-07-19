'use client'

// Sincronización de dispositivos autorizados del OWNER_SUPERADMIN
// Frecuencia simbólica 369-777

import { OWNER_EMAIL, recordOwnerAudit } from './owner'

const DEVICES_KEY = 'zafiro_owner_devices'
const SYNC_KEY = 'zafiro_owner_sync_prefs'
const EVENTS_KEY = 'zafiro_owner_device_events'

export type DeviceStatus = 'PENDING' | 'TRUSTED' | 'REVOKED' | 'BLOCKED'

export interface OwnerDevice {
  id: string
  ownerUserId: string
  deviceFingerprint: string
  deviceName: string
  platform: string
  browser: string
  ipAddress: string
  status: DeviceStatus
  symbolicSeals: string[]
  lastSeenAt: string | null
  createdAt: string
}

export interface DeviceSyncEvent {
  id: string
  deviceId: string
  eventType: string
  actorId: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface SyncPreferences {
  syncEliana: boolean
  syncKnowledge: boolean
  syncProjects: boolean
  syncNotifications: boolean
  syncIntervalMinutes: number
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server'
  const nav = window.navigator
  const screen = window.screen
  const parts = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ]
  let hash = 0
  for (const part of parts) {
    const str = String(part)
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
  }
  return hash.toString(36)
}

function getPlatform(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/mac/i.test(ua)) return 'macos'
  if (/win/i.test(ua)) return 'windows'
  if (/linux/i.test(ua)) return 'linux'
  return 'other'
}

function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/edge/i.test(ua)) return 'edge'
  if (/chrome/i.test(ua)) return 'chrome'
  if (/safari/i.test(ua)) return 'safari'
  if (/firefox/i.test(ua)) return 'firefox'
  return 'other'
}

function loadDevices(): OwnerDevice[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DEVICES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDevices(devices: OwnerDevice[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices))
}

function loadEvents(): DeviceSyncEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEvents(events: DeviceSyncEvent[]): void {
  if (typeof window === 'undefined') return
  if (events.length > 1000) events.splice(0, events.length - 1000)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

let currentUserId = ''

export function setOwnerUserId(uid: string): void {
  currentUserId = uid
}

export function registerCurrentDevice(deviceName?: string): OwnerDevice {
  const devices = loadDevices()
  const fingerprint = getDeviceFingerprint()
  const existing = devices.find(d => d.deviceFingerprint === fingerprint)

  if (existing) {
    existing.lastSeenAt = new Date().toISOString()
    saveDevices(devices)
    return existing
  }

  const device: OwnerDevice = {
    id: generateId(),
    ownerUserId: currentUserId,
    deviceFingerprint: fingerprint,
    deviceName: deviceName || `Dispositivo ${getPlatform()} - ${getBrowser()}`,
    platform: getPlatform(),
    browser: getBrowser(),
    ipAddress: '',
    status: 'PENDING',
    symbolicSeals: ['369', '777'],
    lastSeenAt: null,
    createdAt: new Date().toISOString(),
  }

  devices.push(device)
  saveDevices(devices)
  addDeviceEvent(device.id, 'DEVICE_REGISTERED', { deviceName: device.deviceName })
  recordOwnerAudit('DEVICE_REGISTERED', { deviceId: device.id, platform: device.platform })

  return device
}

export function trustDevice(deviceId: string): OwnerDevice | null {
  const devices = loadDevices()
  const device = devices.find(d => d.id === deviceId)
  if (!device) return null

  device.status = 'TRUSTED'
  device.lastSeenAt = new Date().toISOString()
  saveDevices(devices)
  addDeviceEvent(deviceId, 'DEVICE_TRUSTED', {})
  recordOwnerAudit('DEVICE_TRUSTED', { deviceId })

  return device
}

export function revokeDevice(deviceId: string): OwnerDevice | null {
  const devices = loadDevices()
  const device = devices.find(d => d.id === deviceId)
  if (!device) return null

  device.status = 'REVOKED'
  saveDevices(devices)
  addDeviceEvent(deviceId, 'DEVICE_REVOKED', {})
  recordOwnerAudit('DEVICE_REVOKED', { deviceId })

  return device
}

export function getOwnerDevices(): OwnerDevice[] {
  return loadDevices()
}

export function getCurrentDevice(): OwnerDevice | null {
  const devices = loadDevices()
  const fingerprint = getDeviceFingerprint()
  return devices.find(d => d.deviceFingerprint === fingerprint) || null
}

export function isCurrentDeviceTrusted(): boolean {
  const device = getCurrentDevice()
  return device?.status === 'TRUSTED'
}

function addDeviceEvent(deviceId: string, eventType: string, metadata: Record<string, unknown>): void {
  const events = loadEvents()
  events.push({
    id: generateId(),
    deviceId,
    eventType,
    actorId: currentUserId,
    metadata,
    createdAt: new Date().toISOString(),
  })
  saveEvents(events)
}

export function getDeviceEvents(deviceId: string): DeviceSyncEvent[] {
  return loadEvents().filter(e => e.deviceId === deviceId)
}

export function getSyncPreferences(): SyncPreferences {
  if (typeof window === 'undefined') {
    return { syncEliana: true, syncKnowledge: true, syncProjects: true, syncNotifications: true, syncIntervalMinutes: 15 }
  }
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    return raw ? JSON.parse(raw) : { syncEliana: true, syncKnowledge: true, syncProjects: true, syncNotifications: true, syncIntervalMinutes: 15 }
  } catch {
    return { syncEliana: true, syncKnowledge: true, syncProjects: true, syncNotifications: true, syncIntervalMinutes: 15 }
  }
}

export function saveSyncPreferences(prefs: SyncPreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SYNC_KEY, JSON.stringify(prefs))
  recordOwnerAudit('SYNC_PREFERENCES_UPDATED', { prefs })
}

export function syncNow(): { synced: string[]; timestamp: string } {
  const timestamp = new Date().toISOString()
  const prefs = getSyncPreferences()
  const synced: string[] = []

  if (prefs.syncEliana) synced.push('eliana')
  if (prefs.syncKnowledge) synced.push('knowledge')
  if (prefs.syncProjects) synced.push('projects')
  if (prefs.syncNotifications) synced.push('notifications')

  const device = getCurrentDevice()
  if (device) {
    device.lastSeenAt = timestamp
    const devices = loadDevices()
    const idx = devices.findIndex(d => d.id === device.id)
    if (idx !== -1) {
      devices[idx].lastSeenAt = timestamp
      saveDevices(devices)
    }
    addDeviceEvent(device.id, 'DEVICE_SYNCED', { synced })
  }

  recordOwnerAudit('SYNC_EXECUTED', { synced })
  return { synced, timestamp }
}
