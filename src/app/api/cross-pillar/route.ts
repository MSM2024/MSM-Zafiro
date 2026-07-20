import { NextResponse } from "next/server"
import { getCrossPillarStats } from "@/lib/cross-pillar-stats"
import { getActivityTimeline } from "@/lib/activity-timeline"
import { getAllNotifications } from "@/lib/notifications"

export async function GET() {
  const stats = getCrossPillarStats()
  const timeline = getActivityTimeline(20)
  const notifications = getAllNotifications().slice(0, 10)

  return NextResponse.json({
    stats,
    timeline,
    notifications,
    generatedAt: new Date().toISOString(),
    pillars: {
      identity: { label: "Identidad", entries: stats.identity.profiles },
      marketplace: { label: "Marketplace", entries: stats.marketplace.products + stats.marketplace.orders },
      editorial: { label: "Editorial", entries: stats.editorial.books + stats.editorial.devocionales + stats.editorial.writers },
      economy: { label: "Economía", entries: stats.economy.ledgerEntries },
      sellos: { label: "Sellos", entries: stats.sellos.total },
    },
  })
}
