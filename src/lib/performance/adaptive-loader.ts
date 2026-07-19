'use client'

import type { ZafiroNetworkMode } from './network-mode'
import { getNetworkMode } from './network-mode'

type LoadPriority = 'critical' | 'high' | 'normal' | 'low' | 'deferred'

interface LoadableModule {
  key: string
  priority: LoadPriority
  load: () => Promise<unknown>
  dependencies?: string[]
  modeFilter?: ZafiroNetworkMode[]
}

const PRIORITY_ORDER: LoadPriority[] = ['critical', 'high', 'normal', 'low', 'deferred']

const moduleQueue: LoadableModule[] = []
let isProcessing = false

export function registerModule(mod: LoadableModule): void {
  moduleQueue.push(mod)
  if (!isProcessing) processQueue()
}

export async function loadWithPriority<T>(
  key: string,
  loader: () => Promise<T>,
  priority: LoadPriority = 'normal',
): Promise<T | null> {
  const mode = getNetworkMode()
  if (priority === 'deferred' && mode === 'LIGHT') return null
  if (priority === 'low' && mode === 'OFFLINE') return null

  try {
    return await loader()
  } catch {
    return null
  }
}

async function processQueue(): Promise<void> {
  isProcessing = true
  const mode = getNetworkMode()

  const sorted = [...moduleQueue].sort((a, b) => {
    return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  })

  for (const mod of sorted) {
    if (mod.modeFilter && !mod.modeFilter.includes(mode)) continue
    if (mod.priority === 'deferred' && mode === 'LIGHT') continue
    if (mod.priority === 'low' && mode === 'OFFLINE') continue

    try {
      await mod.load()
    } catch { /* module load error */ }
  }

  moduleQueue.length = 0
  isProcessing = false
}

export function getModulePriority(key: string, mode?: ZafiroNetworkMode): LoadPriority {
  const effectiveMode = mode || getNetworkMode()
  const deferredModules = ['holo-cinema', '3d-viewer', 'analytics-video', 'heavy-chart', 'avatar-3d']
  const lightDeferred = ['particles', 'advanced-animations', 'voice-input', 'camera']

  if (deferredModules.includes(key) && effectiveMode !== 'FULL') return 'deferred'
  if (lightDeferred.includes(key) && effectiveMode === 'LIGHT') return 'deferred'
  if (key === 'eliana-chat' && effectiveMode === 'OFFLINE') return 'low'
  if (key === 'payments-qr') return 'high'
  if (key === 'profile-data') return 'critical'
  if (key === 'marketplace-catalog') return effectiveMode === 'LIGHT' ? 'normal' : 'high'

  return 'normal'
}

export function shouldRenderComponent(componentKey: string, mode?: ZafiroNetworkMode): boolean {
  const effectiveMode = mode || getNetworkMode()
  const priority = getModulePriority(componentKey, effectiveMode)
  if (effectiveMode === 'OFFLINE' && priority === 'deferred') return false
  if (effectiveMode === 'LIGHT' && priority === 'deferred') return false
  return true
}
