// Knowledge Registry — Índice Maestro de los 9 Dominios
// Frecuencia 369-777
// Rastrea qué conocimiento está cargado, su fuente, prioridad y estado

import type { KnowledgeCategory, KnowledgeDocument } from './retrieval'

export type DomainStatus = 'loaded' | 'partial' | 'missing' | 'external'

export interface KnowledgeDomain {
  id: string
  name: string
  description: string
  status: DomainStatus
  sourcePriority: SourcePriority
  categories: KnowledgeCategory[]
  entryPoints: string[]
  docCount: number
  lastUpdated: string
}

export type SourcePriority = 'supabase_ledger' | 'owner_order' | 'active_policy' | 'documents' | 'authorized_memory' | 'general'

const SOURCE_ORDER: SourcePriority[] = [
  'supabase_ledger',
  'owner_order',
  'active_policy',
  'documents',
  'authorized_memory',
  'general',
]

export const SOURCE_PRIORITY_LABELS: Record<SourcePriority, string> = {
  supabase_ledger: '🔵 Datos reales',
  owner_order: '🟣 Orden propietario',
  active_policy: '🟢 Política activa',
  documents: '🟡 Documentos',
  authorized_memory: '🟠 Memoria autorizada',
  general: '⚪ Conocimiento general',
}

const DOMAINS: KnowledgeDomain[] = [
  {
    id: 'msm_my_store',
    name: 'MSM MY STORE LLC',
    description: 'Empresa, misión, estructura legal, propiedad intelectual',
    status: 'loaded',
    sourcePriority: 'documents',
    categories: ['MSM'],
    entryPoints: ['knowledge-data.ts', 'zafiro-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'remesas_cambios',
    name: 'Remesas Cambios Divisas Tasas',
    description: 'Servicios de remesas, tipos de cambio, operaciones financieras',
    status: 'loaded',
    sourcePriority: 'active_policy',
    categories: ['ECONOMIA'],
    entryPoints: ['tasas.ts', 'bpa-mirror.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'catalogo_comercio',
    name: 'Catálogo Inventario Clientes VIP',
    description: 'Productos, inventario, clientes, vendedores, condiciones VIP',
    status: 'partial',
    sourcePriority: 'documents',
    categories: ['MSM', 'ZAFIRO'],
    entryPoints: ['zafiro-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'zafiro_arquitectura',
    name: 'ZAFIRO Arquitectura',
    description: 'Arquitectura, funciones, perfiles, círculos, sponsors, gemología',
    status: 'loaded',
    sourcePriority: 'documents',
    categories: ['ZAFIRO'],
    entryPoints: ['zafiro-data.ts', 'knowledge-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'eliana_identidad',
    name: 'ELIANA Identidad Memoria',
    description: 'Identidad, memoria, seguridad, herramientas, auditoría',
    status: 'loaded',
    sourcePriority: 'owner_order',
    categories: ['ZAFIRO'],
    entryPoints: ['system-prompt.ts', 'intent-classifier.ts', 'owner-firewall.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'cajeros_payments',
    name: 'Cajeros MSM Payments Wallet',
    description: 'Cajeros MSM, MSM Payments, Wallet, Coins, Economía',
    status: 'partial',
    sourcePriority: 'documents',
    categories: ['CAJEROS', 'ECONOMIA'],
    entryPoints: ['zafiro-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'proyectos_mentemaestra',
    name: 'Mente Maestra La Suiza Villa Esperanza',
    description: 'Mente Maestra, La Suiza de Cuba, Villa Esperanza y proyectos',
    status: 'loaded',
    sourcePriority: 'documents',
    categories: ['MENTE_MAESTRA', 'LA_SUIZA', 'VILLA_ESPERANZA'],
    entryPoints: ['knowledge-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'album_vida',
    name: 'Álbum de la Vida',
    description: 'Genealogía, documentos, libros, imágenes, contenido familiar',
    status: 'loaded',
    sourcePriority: 'documents',
    categories: ['ZAFIRO'],
    entryPoints: ['familia.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
  {
    id: 'programacion_tecnica',
    name: 'Programación Técnica',
    description: 'OpenCode, Codex, Supabase, Next.js, APIs, despliegue',
    status: 'loaded',
    sourcePriority: 'documents',
    categories: ['MSM'],
    entryPoints: ['knowledge-data.ts'],
    docCount: 0,
    lastUpdated: '2026-07-17',
  },
]

let docsLoaded = false

function getDocCountsForDomains(): void {
  if (docsLoaded) return
  docsLoaded = true
  try {
    // Dynamic import to avoid circular dependency
    import('./retrieval').then(({ getDocuments }) => {
      const docs = getDocuments()
      for (const domain of DOMAINS) {
        const relevant = docs.filter((d: KnowledgeDocument) => domain.categories.includes(d.category as KnowledgeCategory))
        domain.docCount = relevant.length
      }
    }).catch(() => {
      // Retrieval system not available yet
    })
  } catch {
    // Import not available
  }
}

export function getDomains(): KnowledgeDomain[] {
  getDocCountsForDomains()
  return DOMAINS
}

export function getDomain(id: string): KnowledgeDomain | undefined {
  getDocCountsForDomains()
  return DOMAINS.find(d => d.id === id)
}

export function getDomainStatusSummary(): string {
  getDocCountsForDomains()
  const lines = DOMAINS.map(d => {
    const statusIcon = d.status === 'loaded' ? '✅' : d.status === 'partial' ? '⚠️' : '❌'
    return `${statusIcon} ${d.name} — ${d.docCount} docs, fuente: ${SOURCE_PRIORITY_LABELS[d.sourcePriority]}`
  })
  return lines.join('\n')
}

export function getSourcePriorityWeight(source: SourcePriority): number {
  const idx = SOURCE_ORDER.indexOf(source)
  return idx >= 0 ? SOURCE_ORDER.length - idx : 0
}

export function isDomainCovered(query: string): { covered: boolean; domain?: KnowledgeDomain } {
  const lower = query.toLowerCase()
  for (const domain of DOMAINS) {
    const keywords = domain.name.toLowerCase().split(/\s+/).concat(domain.description.toLowerCase().split(/\s+/))
    const matchCount = keywords.filter(k => k.length > 3 && lower.includes(k)).length
    if (matchCount >= 2) return { covered: true, domain }
  }
  return { covered: false }
}
