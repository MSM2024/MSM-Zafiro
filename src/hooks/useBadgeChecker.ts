'use client'

import { useEffect, useRef, useState } from "react"
import { checkAndAwardBadges, getBadgeStats, updateBadgeStats, type BadgeDefinition } from "@/lib/badges"
import { getProfiles } from "@/lib/identity"
import { getActiveProducts, getOrders } from "@/lib/marketplace"
import { getLedgerEntries } from "@/lib/ledger"
import { getBooks } from "@/lib/biblioteca/storage"
import { getPublishedSeals } from "@/lib/seals-data"
import { getDevocionales } from "@/lib/editorial"

export function useBadgeChecker() {
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([])
  const prevCount = useRef(0)

  useEffect(() => {
    const check = () => {
      const stats = {
        profiles: getProfiles().length,
        kycApproved: 0,
        vip: 0,
        products: getActiveProducts().length,
        orders: getOrders().length,
        ledgerEntries: getLedgerEntries().length,
        books: getBooks().filter(b => b.status === "PUBLICADO").length,
        devocionales: getDevocionales().length,
        seals: getPublishedSeals().length,
        totalBadges: (JSON.parse(localStorage.getItem("zafiro_user_badges") || "[]")).length,
      }
      const prev = getBadgeStats()
      if (prev.profiles !== undefined) {
        const earned = checkAndAwardBadges(stats)
        if (earned.length > 0) setNewBadges(earned)
      }
      updateBadgeStats(stats)
    }
    check()
  }, [])

  return newBadges
}
