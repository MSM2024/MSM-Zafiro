'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Diamond, Smartphone, Wallet, ShieldCheck } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import Link from "next/link"
import HolographicQrCard from "@/components/payments/HolographicQrCard"
import type { PaymentMethod } from "@/lib/payments/config"

type Step = 'SELECTOR' | 'USDT' | 'VENMO'

const methods: { method: PaymentMethod; label: string; desc: string; icon: typeof Wallet }[] = [
  { method: 'usdt', label: 'PAGO CON USDT', desc: 'USDT en red TRC-20 — Rápido y seguro', icon: Wallet },
  { method: 'venmo', label: 'PAGO CON VENMO', desc: 'Escanea el código QR oficial de Venmo', icon: Smartphone },
]

export default function PagarPage() {
  usePageTitle("MSM Payment — ZAFIRO")
  const [step, setStep] = useState<Step>('SELECTOR')

  return (
    <main className="min-h-screen bg-[#050816] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {step === 'SELECTOR' && (
              <motion.div key="selector" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-violet-600 shadow-lg shadow-[#00D9FF]/20 mb-4">
                    <Diamond className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-white">MSM Payment</h1>
                  <p className="text-sm text-slate-400 mt-1">Selecciona tu método de pago</p>
                </div>

                <div className="space-y-3">
                  {methods.map((m, i) => {
                    const Icon = m.icon
                    return (
                      <motion.button
                        key={m.method}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setStep(m.method === 'usdt' ? 'USDT' : 'VENMO')}
                        className="w-full p-5 rounded-2xl glass glass-hover text-left group border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center group-hover:from-[#00D9FF]/20 group-hover:to-violet-600/20 transition-all">
                            <Icon className="w-6 h-6 text-slate-400 group-hover:text-[#00D9FF] transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-bold text-white group-hover:text-[#00D9FF] transition-colors">{m.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                          </div>
                          <ShieldCheck className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
                  </Link>
                </div>
              </motion.div>
            )}

            {step === 'USDT' && (
              <motion.div key="usdt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <HolographicQrCard method="usdt" onBack={() => setStep('SELECTOR')} />
              </motion.div>
            )}

            {step === 'VENMO' && (
              <motion.div key="venmo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <HolographicQrCard method="venmo" onBack={() => setStep('SELECTOR')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
