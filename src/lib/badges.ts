export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  pillar: string
  condition: (stats: Record<string, number>) => boolean
  tier: "bronze" | "silver" | "gold" | "platinum"
}

export interface UserBadge {
  badgeId: string
  earnedAt: string
}

const BADGES_KEY = "zafiro_user_badges"
const BADGE_STATS_KEY = "zafiro_badge_stats"

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: "first_profile", name: "Primer Perfil", description: "Crear tu primer perfil en ZAFIRO", icon: "👤", pillar: "identity", condition: (s) => (s.profiles || 0) >= 1, tier: "bronze" },
  { id: "kyc_complete", name: "Verificado", description: "Completar verificación KYC", icon: "✅", pillar: "identity", condition: (s) => (s.kycApproved || 0) >= 1, tier: "silver" },
  { id: "vip_member", name: "Miembro VIP", description: "Alcanzar estatus VIP", icon: "👑", pillar: "identity", condition: (s) => (s.vip || 0) >= 1, tier: "gold" },
  { id: "first_product", name: "Primer Producto", description: "Listar tu primer producto en el Marketplace", icon: "📦", pillar: "marketplace", condition: (s) => (s.products || 0) >= 1, tier: "bronze" },
  { id: "first_order", name: "Primera Venta", description: "Recibir tu primer pedido", icon: "🛒", pillar: "marketplace", condition: (s) => (s.orders || 0) >= 1, tier: "bronze" },
  { id: "ten_orders", name: "Vendedor Activo", description: "Alcanzar 10 pedidos", icon: "📈", pillar: "marketplace", condition: (s) => (s.orders || 0) >= 10, tier: "silver" },
  { id: "first_ledger", name: "Primer Movimiento", description: "Registrar tu primera entrada en el Ledger", icon: "💰", pillar: "economy", condition: (s) => (s.ledgerEntries || 0) >= 1, tier: "bronze" },
  { id: "ledger_master", name: "Maestro del Ledger", description: "Acumular 50 movimientos contables", icon: "📊", pillar: "economy", condition: (s) => (s.ledgerEntries || 0) >= 50, tier: "silver" },
  { id: "first_book", name: "Primer Libro", description: "Publicar tu primer libro", icon: "📖", pillar: "editorial", condition: (s) => (s.books || 0) >= 1, tier: "bronze" },
  { id: "first_devocional", name: "Primer Devocional", description: "Escribir tu primer devocional", icon: "✨", pillar: "editorial", condition: (s) => (s.devocionales || 0) >= 1, tier: "bronze" },
  { id: "writer_prolific", name: "Escritor Prolífico", description: "Publicar 5 libros", icon: "✍️", pillar: "editorial", condition: (s) => (s.books || 0) >= 5, tier: "silver" },
  { id: "first_seal", name: "Primer Sello", description: "Obtener tu primer sello 369", icon: "🔶", pillar: "sellos", condition: (s) => (s.seals || 0) >= 1, tier: "bronze" },
  { id: "seal_collector", name: "Coleccionista", description: "Acumular 10 sellos", icon: "🔷", pillar: "sellos", condition: (s) => (s.seals || 0) >= 10, tier: "silver" },
  { id: "seal_master", name: "Maestro 369", description: "Acumular 50 sellos", icon: "💎", pillar: "sellos", condition: (s) => (s.seals || 0) >= 50, tier: "gold" },
  { id: "full_ecosystem", name: "Ecosistema Completo", description: "Participar en los 5 pilares", icon: "🌐", pillar: "zafiro", condition: (s) => (s.profiles || 0) > 0 && (s.products || 0) > 0 && (s.books || 0) > 0 && (s.ledgerEntries || 0) > 0 && (s.seals || 0) > 0, tier: "platinum" },
  { id: "all_bronze", name: "Bronce Universal", description: "Obtener todas las insignias de bronce", icon: "🥉", pillar: "zafiro", condition: (s) => (s.totalBadges || 0) >= 6, tier: "silver" },
]

export function getUserBadges(): UserBadge[] {
  try {
    return JSON.parse(localStorage.getItem(BADGES_KEY) || "[]")
  } catch { return [] }
}

export function computeEarnedBadges(stats: Record<string, number>): BadgeDefinition[] {
  const earned = getUserBadges().map(b => b.badgeId)
  return BADGE_DEFINITIONS.filter(b => !earned.includes(b.id) && b.condition(stats))
}

export function awardBadge(badgeId: string) {
  const badges = getUserBadges()
  if (badges.some(b => b.badgeId === badgeId)) return false
  badges.push({ badgeId, earnedAt: new Date().toISOString() })
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges))
  return true
}

export function checkAndAwardBadges(stats: Record<string, number>): BadgeDefinition[] {
  const newBadges = computeEarnedBadges(stats)
  for (const badge of newBadges) awardBadge(badge.id)
  return newBadges
}

export function getBadgeStats(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BADGE_STATS_KEY) || "{}")
  } catch { return {} }
}

export function updateBadgeStats(stats: Record<string, number>) {
  localStorage.setItem(BADGE_STATS_KEY, JSON.stringify(stats))
}

export function getBadgeDefinition(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.id === id)
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    bronze: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    silver: "text-slate-300 bg-slate-500/10 border-slate-500/20",
    gold: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    platinum: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  }
  return colors[tier] || "text-slate-400 bg-slate-500/10 border-slate-500/20"
}
