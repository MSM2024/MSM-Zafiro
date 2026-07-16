'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Landmark, RefreshCw, Send, FileText, Copy, Check } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import FounderChallenge from "@/components/FounderChallenge"
import {
  getBalance, updateBalance, getTransfers, addTransfer,
  getDailyUsage, getMonthlyUsage, generateVoucherText,
  BPA_LIMITS, type BPABalance, type BPATransfer,
} from "@/lib/bpa-mirror"

export default function BPAMirrorPage() {
  return (
    <FounderChallenge>
      <BPAMirrorContent />
    </FounderChallenge>
  )
}

function BPAMirrorContent() {
  usePageTitle("BPA Mirror")
  const [balance, setBalance] = useState<BPABalance>({ cup: 0, mlc: 0, lastUpdated: "" })
  const [transfers, setTransfers] = useState<BPATransfer[]>([])
  const [dailyUsed, setDailyUsed] = useState(0)
  const [monthlyUsed, setMonthlyUsed] = useState(0)
  const [editBalance, setEditBalance] = useState(false)
  const [balanceForm, setBalanceForm] = useState({ cup: "", mlc: "" })
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferForm, setTransferForm] = useState({ amount: "", currency: "CUP" as "CUP" | "MLC", recipient: "", concept: "" })
  const [copiedId, setCopiedId] = useState("")

  const refresh = () => {
    setBalance(getBalance())
    setTransfers(getTransfers())
    setDailyUsed(getDailyUsage())
    setMonthlyUsed(getMonthlyUsage())
  }

  useEffect(() => { refresh() }, [])

  const handleBalanceUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateBalance(parseFloat(balanceForm.cup) || 0, parseFloat(balanceForm.mlc) || 0)
    setEditBalance(false)
    refresh()
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(transferForm.amount)
    if (!amount || !transferForm.recipient.trim()) return
    addTransfer({
      amount,
      currency: transferForm.currency,
      recipient: transferForm.recipient,
      concept: transferForm.concept,
      date: new Date().toISOString(),
    })
    setShowTransfer(false)
    setTransferForm({ amount: "", currency: "CUP", recipient: "", concept: "" })
    refresh()
  }

  const copyVoucher = async (t: BPATransfer) => {
    try {
      await navigator.clipboard.writeText(generateVoucherText(t))
      setCopiedId(t.id)
      setTimeout(() => setCopiedId(""), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const dailyPct = Math.min(100, (dailyUsed / BPA_LIMITS.dailyCUP) * 100)
  const monthlyPct = Math.min(100, (monthlyUsed / BPA_LIMITS.monthlyCUP) * 100)

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Landmark className="w-7 h-7 text-[#00D9FF]" /> BPA Mirror
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Banco Popular de Ahorro · Sincronizado con el Ledger Maestro
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            ● Espejo activo
          </span>
        </div>

        {/* Saldos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#123B8F]/40 to-white/5 border border-white/10">
            <div className="text-xs text-zinc-400">Cuenta CUP</div>
            <div className="text-3xl font-bold font-mono mt-2">
              {balance.cup.toLocaleString("es-ES")}
            </div>
            <div className="text-xs text-zinc-500 mt-1">pesos cubanos</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2F6B45]/40 to-white/5 border border-white/10">
            <div className="text-xs text-zinc-400">Cuenta MLC</div>
            <div className="text-3xl font-bold font-mono mt-2">
              {balance.mlc.toLocaleString("es-ES")}
            </div>
            <div className="text-xs text-zinc-500 mt-1">moneda libremente convertible</div>
          </div>
        </div>

        <div className="flex gap-3 mb-10">
          <button
            onClick={() => { setBalanceForm({ cup: String(balance.cup), mlc: String(balance.mlc) }); setEditBalance(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" /> Actualizar Manualmente
          </button>
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D9FF] text-[#050816] font-medium text-sm hover:bg-[#00D9FF]/90"
          >
            <Send className="w-4 h-4" /> Registrar Transferencia
          </button>
        </div>

        {/* Límites */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-10">
          <h2 className="text-lg font-semibold mb-6">🛡️ Gestión de Límites</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Límite Diario</span>
                <span className="font-mono">
                  {dailyUsed.toLocaleString("es-ES")} / {BPA_LIMITS.dailyCUP.toLocaleString("es-ES")} CUP
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${dailyPct > 90 ? "bg-red-500" : dailyPct > 70 ? "bg-amber-500" : "bg-[#00D9FF]"}`}
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Límite Mensual</span>
                <span className="font-mono">
                  {monthlyUsed.toLocaleString("es-ES")} / {BPA_LIMITS.monthlyCUP.toLocaleString("es-ES")} CUP
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${monthlyPct > 90 ? "bg-red-500" : monthlyPct > 70 ? "bg-amber-500" : "bg-[#2F6B45]"}`}
                  style={{ width: `${monthlyPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">📝 Registro de Transferencias</h2>
          {transfers.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              Sin transferencias registradas. Usa &ldquo;Registrar Transferencia&rdquo; para llevar el control.
            </p>
          ) : (
            <div className="space-y-3">
              {transfers.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="font-medium text-sm">{t.recipient}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(t.date).toLocaleDateString("es-ES")} · {t.voucherCode}
                      {t.concept && ` · ${t.concept}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">
                      {t.amount.toLocaleString("es-ES")} <span className="text-xs text-zinc-400">{t.currency}</span>
                    </span>
                    <button
                      onClick={() => copyVoucher(t)}
                      title="Generar Comprobante ZAFIRO"
                      className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
                    >
                      {copiedId === t.id ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Actualizar saldo */}
        {editBalance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form onSubmit={handleBalanceUpdate} className="w-full max-w-sm rounded-2xl bg-[#0a1128] border border-white/10 p-6 space-y-4">
              <h2 className="font-semibold">Actualizar Saldos</h2>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Saldo CUP</label>
                <input type="number" step="0.01" value={balanceForm.cup}
                  onChange={(e) => setBalanceForm({ ...balanceForm, cup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Saldo MLC</label>
                <input type="number" step="0.01" value={balanceForm.mlc}
                  onChange={(e) => setBalanceForm({ ...balanceForm, mlc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditBalance(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm">Cancelar</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00D9FF] text-[#050816] font-semibold text-sm">Guardar</button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Transferencia */}
        {showTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form onSubmit={handleTransfer} className="w-full max-w-sm rounded-2xl bg-[#0a1128] border border-white/10 p-6 space-y-4">
              <h2 className="font-semibold">Registrar Transferencia</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Monto</label>
                  <input type="number" step="0.01" required value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Moneda</label>
                  <select value={transferForm.currency}
                    onChange={(e) => setTransferForm({ ...transferForm, currency: e.target.value as "CUP" | "MLC" })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-white [&>option]:bg-[#0a1128]">
                    <option value="CUP">CUP</option>
                    <option value="MLC">MLC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Destinatario *</label>
                <input type="text" required value={transferForm.recipient}
                  onChange={(e) => setTransferForm({ ...transferForm, recipient: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF]" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Concepto</label>
                <input type="text" value={transferForm.concept}
                  onChange={(e) => setTransferForm({ ...transferForm, concept: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF]" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowTransfer(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm">Cancelar</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00D9FF] text-[#050816] font-semibold text-sm">Registrar</button>
              </div>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-zinc-500 mt-8">
          BPA Mirror es un espejo de control personal — no se conecta al banco real.
          <br />Cada comprobante lleva código ZAF único y sello 369-777.
        </p>
      </div>
    </div>
  )
}
