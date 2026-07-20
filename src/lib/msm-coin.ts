'use client'

export interface MsmCoinWallet {
  userId: string
  balance: number
  reserved: number
  totalMinted: number
  totalBurned: number
  lastUpdated: string
}

export interface MsmCoinTransaction {
  id: string
  type: "mint" | "transfer" | "burn" | "reward"
  amount: number
  from?: string
  to?: string
  concept: string
  status: "simulated"
  createdAt: string
}

const WALLET_KEY = "zafiro_msm_coin_wallet"
const TX_KEY = "zafiro_msm_coin_tx"

export function getWallet(userId: string): MsmCoinWallet {
  if (typeof window === "undefined") return emptyWallet(userId)
  try {
    const wallets: Record<string, MsmCoinWallet> = JSON.parse(localStorage.getItem(WALLET_KEY) || "{}")
    return wallets[userId] || emptyWallet(userId)
  } catch { return emptyWallet(userId) }
}

function emptyWallet(userId: string): MsmCoinWallet {
  return { userId, balance: 0, reserved: 0, totalMinted: 0, totalBurned: 0, lastUpdated: "" }
}

export function getTransactions(userId: string): MsmCoinTransaction[] {
  if (typeof window === "undefined") return []
  try {
    const all: Record<string, MsmCoinTransaction[]> = JSON.parse(localStorage.getItem(TX_KEY) || "{}")
    return (all[userId] || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch { return [] }
}

export function getMsmCoinStats(): { totalWallets: number; totalSupply: number; activeUsers: number } {
  if (typeof window === "undefined") return { totalWallets: 0, totalSupply: 0, activeUsers: 0 }
  try {
    const wallets: Record<string, MsmCoinWallet> = JSON.parse(localStorage.getItem(WALLET_KEY) || "{}")
    const totalSupply = Object.values(wallets).reduce((s, w) => s + w.balance, 0)
    return { totalWallets: Object.keys(wallets).length, totalSupply, activeUsers: Object.values(wallets).filter(w => w.balance > 0).length }
  } catch { return { totalWallets: 0, totalSupply: 0, activeUsers: 0 } }
}

export const MSM_COIN_INFO = {
  name: "MSM Coin",
  symbol: "MSM",
  decimals: 6,
  network: "ZAFIRO Ledger (simulado)",
  status: "interfaz_solo" as const,
  description: "MSM Coin es la moneda digital del ecosistema MSM. Actualmente en fase de interfaz — sin blockchain real, sin transacciones reales.",
}
