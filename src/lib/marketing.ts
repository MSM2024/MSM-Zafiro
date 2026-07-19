export interface MarketingAsset {
  id: string
  name: string
  type: 'sticker' | 'video' | 'image' | 'brand_kit'
  format: 'square' | 'vertical' | 'horizontal' | 'story' | 'status'
  platform: 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'web' | 'all'
  description: string
  tags: string[]
  status: 'draft' | 'ready' | 'published'
  previewUrl?: string
  fileUrl?: string
  createdAt: string
  updatedAt: string
}

const ASSETS_KEY = 'zafiro_marketing_assets'

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}
function lsSet<T>(key: string, data: T): void { localStorage.setItem(key, JSON.stringify(data)) }

const SEED_ASSETS: MarketingAsset[] = [
  { id: 'm1', name: 'Ángel Guardián ZAFIRO', type: 'sticker', format: 'square', platform: 'whatsapp', description: 'Sticker angelical con escudo ZAFIRO y frecuencia 369', tags: ['angel', 'proteccion', '369'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm2', name: 'Logo ZAFIRO Dorado', type: 'sticker', format: 'square', platform: 'all', description: 'Logo ZAFIRO con efecto dorado sobre fondo azul zafiro', tags: ['logo', 'marca'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm3', name: 'Frecuencia 369', type: 'sticker', format: 'square', platform: 'all', description: 'Representación visual de la frecuencia 369 en espiral', tags: ['369', 'espiritual'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm4', name: 'MSM MY STORE — Anuncio Principal', type: 'video', format: 'horizontal', platform: 'facebook', description: 'Anuncio 8K del ecosistema MSM: ZAFIRO, Marketplace, Editorial, Economía', tags: ['anuncio', '8k', 'ecosistema'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm5', name: 'MSM MY STORE — Vertical', type: 'video', format: 'vertical', platform: 'instagram', description: 'Versión vertical del anuncio principal para Reels/Stories', tags: ['anuncio', 'vertical', 'reels'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm6', name: 'MSM MY STORE — Estado WhatsApp', type: 'image', format: 'status', platform: 'whatsapp', description: 'Versión para estado de WhatsApp con llamado a la acción', tags: ['whatsapp', 'estado'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm7', name: 'Kit de Marca MSM', type: 'brand_kit', format: 'square', platform: 'all', description: 'Logos, colores, tipografías y guías de uso de la marca MSM', tags: ['kit', 'marca', 'guia'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm8', name: 'Villa Esperanza — Llamado', type: 'image', format: 'horizontal', platform: 'facebook', description: 'Imagen promocional de Villa Esperanza con meta de $5M', tags: ['villa-esperanza', 'donacion'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm9', name: 'Ángel de la Abundancia', type: 'sticker', format: 'square', platform: 'telegram', description: 'Sticker con ángel y símbolo de abundancia infinita', tags: ['angel', 'abundancia'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm10', name: 'Seguridad Angel Security', type: 'image', format: 'square', platform: 'web', description: 'Badge de seguridad Angel Security para el ecosistema', tags: ['seguridad', 'angel-security'], status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export function getAssets(): MarketingAsset[] {
  const stored = lsGet<MarketingAsset[]>(ASSETS_KEY, [])
  if (stored.length === 0) { lsSet(ASSETS_KEY, SEED_ASSETS); return SEED_ASSETS }
  return stored
}

export function updateAssetStatus(id: string, status: MarketingAsset['status']): void {
  const list = getAssets()
  const a = list.find(x => x.id === id)
  if (a) { a.status = status; a.updatedAt = new Date().toISOString(); lsSet(ASSETS_KEY, list) }
}

export function getBrandColors() {
  return [
    { name: 'Azul Zafiro', hex: '#00D9FF', usage: 'Primario — acentos, botones, enlaces' },
    { name: 'Azul Noche', hex: '#050816', usage: 'Fondo principal' },
    { name: 'Azul Oscuro', hex: '#0A0B1A', usage: 'Tarjetas y paneles' },
    { name: 'Borde', hex: '#1A1B3A', usage: 'Bordes y separadores' },
    { name: 'Dorado', hex: '#FFD700', usage: 'Acentos premium, memberships' },
    { name: 'Blanco', hex: '#FFFFFF', usage: 'Texto principal' },
    { name: 'Plata', hex: '#94A3B8', usage: 'Texto secundario' },
    { name: 'Verde Esmeralda', hex: '#34D399', usage: 'Éxito, confirmación' },
    { name: 'Ámbar', hex: '#FBBF24', usage: 'Advertencia, pendiente' },
    { name: 'Rojo', hex: '#EF4444', usage: 'Error, alerta crítica' },
  ]
}
