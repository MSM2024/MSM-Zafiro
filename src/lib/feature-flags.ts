// Feature Flags — ZAFIRO Canary Deployment System
// Frecuencia 369-777

export type FeatureFlag =
  | 'NEW_AUTH_ENABLED'
  | 'SUPABASE_PROFILE_ENABLED'
  | 'SERVER_SESSION_ENABLED'
  | 'RLS_ENFORCED'
  | 'ELIANA_REAL_DATA_ENABLED'
  | 'ECONOMY_BACKEND_ENABLED'
  | 'SECURITY_MIDDLEWARE_ENABLED'
  | 'STRIPE_LIVE_ENABLED'
  | 'WHATSAPP_LIVE_ENABLED'
  | 'KYC_LIVE_ENABLED'

export interface FeatureFlagState {
  flag: FeatureFlag
  enabled: boolean
  description: string
  stage: 'alpha' | 'beta' | 'canary' | 'production'
  ownerOnly: boolean
}

const FLAGS_STORAGE_KEY = 'zafiro_feature_flags'

const DEFAULT_FLAGS: FeatureFlagState[] = [
  { flag: 'NEW_AUTH_ENABLED', enabled: false, description: 'Nuevo sistema de autenticación con Supabase', stage: 'alpha', ownerOnly: true },
  { flag: 'SUPABASE_PROFILE_ENABLED', enabled: false, description: 'Perfiles persistentes en Supabase', stage: 'alpha', ownerOnly: true },
  { flag: 'SERVER_SESSION_ENABLED', enabled: false, description: 'Sesiones manejadas del lado servidor', stage: 'alpha', ownerOnly: true },
  { flag: 'RLS_ENFORCED', enabled: false, description: 'Row Level Security obligatorio en Supabase', stage: 'alpha', ownerOnly: true },
  { flag: 'ELIANA_REAL_DATA_ENABLED', enabled: false, description: 'ELIANA con datos reales de Supabase', stage: 'beta', ownerOnly: true },
  { flag: 'ECONOMY_BACKEND_ENABLED', enabled: false, description: 'Backend económico con persistencia real', stage: 'beta', ownerOnly: true },
  { flag: 'SECURITY_MIDDLEWARE_ENABLED', enabled: false, description: 'Middleware de seguridad en API routes', stage: 'alpha', ownerOnly: true },
  { flag: 'STRIPE_LIVE_ENABLED', enabled: false, description: 'Pagos reales con Stripe Live', stage: 'alpha', ownerOnly: true },
  { flag: 'WHATSAPP_LIVE_ENABLED', enabled: false, description: 'WhatsApp con token real', stage: 'alpha', ownerOnly: true },
  { flag: 'KYC_LIVE_ENABLED', enabled: false, description: 'KYC/KYB con proveedor externo real', stage: 'alpha', ownerOnly: true },
]

export function getFeatureFlags(): FeatureFlagState[] {
  if (typeof window === 'undefined') return DEFAULT_FLAGS
  try {
    const raw = localStorage.getItem(FLAGS_STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw) as FeatureFlagState[]
      return DEFAULT_FLAGS.map(def => {
        const s = stored.find((f: FeatureFlagState) => f.flag === def.flag)
        return s || def
      })
    }
  } catch { /* ignore */ }
  return DEFAULT_FLAGS
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const flags = getFeatureFlags()
  const f = flags.find(f => f.flag === flag)
  return f?.enabled ?? false
}

export function setFeatureFlag(flag: FeatureFlag, enabled: boolean, ownerOverride?: boolean): boolean {
  if (typeof window === 'undefined') return false
  const flags = getFeatureFlags()
  const idx = flags.findIndex(f => f.flag === flag)
  if (idx === -1) return false
  if (!ownerOverride && flags[idx].ownerOnly) return false
  flags[idx].enabled = enabled
  localStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(flags))
  window.dispatchEvent(new CustomEvent('zafiro-feature-flags-changed', { detail: { flag, enabled } }))
  return true
}

export function resetFeatureFlags(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(FLAGS_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('zafiro-feature-flags-changed', { detail: { reset: true } }))
}

export function getStageLabel(stage: FeatureFlagState['stage']): string {
  const labels: Record<string, string> = {
    alpha: '🧪 Solo OWNER',
    beta: '🔬 Equipo autorizado',
    canary: '🐤 5% usuarios',
    production: '✅ 100%',
  }
  return labels[stage] || stage
}
