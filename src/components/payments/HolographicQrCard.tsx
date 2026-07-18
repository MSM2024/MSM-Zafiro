'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Copy, Check, Expand, X, ArrowLeft, Diamond, AlertTriangle, Shield, Loader2, Smartphone, Send, Clock } from "lucide-react"
import QrCode from "./QrCode"
import type { PaymentMethod, QrStatus } from "@/lib/payments/config"
import { PAYMENT_METHODS } from "@/lib/payments/config"
import { savePaymentRecord, confirmPayment, getLastPayment, type PaymentRecord } from "@/lib/payments/storage"

interface Props {
  method: PaymentMethod
  onBack: () => void
}

export default function HolographicQrCard({ method, onBack }: Props) {
  const config = PAYMENT_METHODS[method]
  const [qrStatus, setQrStatus] = useState<QrStatus>('QR_LOADING')
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [activePayment, setActivePayment] = useState<PaymentRecord | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<'idle' | 'saved' | 'confirmed'>('idle')
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced.current) setParticlesEnabled(false)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!config.walletAddress) return
    try {
      await navigator.clipboard.writeText(config.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* silent */ }
  }, [config.walletAddress])

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
  }))

  const getStatusDisplay = () => {
    switch (qrStatus) {
      case 'QR_LOADING':
        return { icon: Loader2, text: 'Generando QR...', color: 'text-[#00D9FF]' }
      case 'QR_READY':
        return { icon: Shield, text: 'QR listo para escanear', color: 'text-emerald-400' }
      case 'QR_UNAVAILABLE':
        return { icon: AlertTriangle, text: 'QR USDT PENDIENTE', color: 'text-amber-400' }
      case 'QR_INVALID':
        return { icon: AlertTriangle, text: 'QR inválido', color: 'text-red-400' }
      case 'QR_VERIFIED':
        return { icon: Shield, text: 'QR verificado', color: 'text-emerald-400' }
    }
  }

  const statusDisplay = getStatusDisplay()

  const qrSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 360

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
        <div className="relative perspective-[1000px]">
          {/* Sombra flotante */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-[#00D9FF]/10 blur-xl rounded-full" />

          {/* Anillos de energía exteriores */}
          <div className="absolute -inset-4 pointer-events-none">
            <div className="absolute inset-0 rounded-3xl border border-[#00D9FF]/10 animate-[spin_8s_linear_infinite]" style={{ animationDuration: '8s' }} />
            {!prefersReduced.current && (
              <div className="absolute inset-0 rounded-3xl border border-violet-500/10 animate-[spin_12s_linear_infinite]" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            )}
          </div>

          {/* Partículas de fondo */}
          {particlesEnabled && !prefersReduced.current && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  className="absolute w-1 h-1 rounded-full bg-[#00D9FF]/40"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.7, 0.2],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Tarjeta principal */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0A1628] via-[#0D1F3C] to-[#0A1628] border border-[#00D9FF]/20 shadow-xl shadow-black/50 overflow-hidden">
            {/* Pulso luminoso */}
            {!prefersReduced.current && (
              <motion.div
                className="absolute -inset-32 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(0,217,255,0.06) 0%, transparent 60%)',
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* Reflejo holográfico */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Encabezado */}
            <div className="relative px-5 pt-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#00D9FF]" />
                <span className="text-sm font-bold text-white">{config.label}</span>
              </div>
              <span className="text-[10px] text-slate-500">{config.network || ''}</span>
            </div>

            {/* Marco de cristal del QR */}
            <div className="relative px-5 pb-3">
              <div className="relative rounded-xl bg-white p-3 shadow-lg shadow-black/30">
                {/* Resplandor violeta alrededor */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00D9FF]/20 via-violet-500/20 to-[#00D9FF]/20 blur-sm pointer-events-none" />

                {qrStatus === 'QR_UNAVAILABLE' ? (
                  <div className="flex flex-col items-center justify-center" style={{ width: qrSize, height: qrSize }}>
                    <Diamond className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-400">QR USDT PENDIENTE</p>
                    <p className="text-[10px] text-slate-600 mt-1">Disponible próximamente</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00D9FF]/10 via-violet-500/10 to-[#00D9FF]/10 rounded-xl blur-sm pointer-events-none" />
                    <QrCode
                      data={config.qrData}
                      size={qrSize}
                      status={qrStatus}
                      onStatusChange={setQrStatus}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="px-5 pb-2">
              <div className="flex items-center justify-center gap-1.5">
                <statusDisplay.icon className={`w-3 h-3 ${statusDisplay.color} ${qrStatus === 'QR_LOADING' ? 'animate-spin' : ''}`} />
                <span className={`text-[10px] ${statusDisplay.color}`}>{statusDisplay.text}</span>
              </div>
            </div>

            {/* Dirección / datos */}
            {config.walletAddress && (
              <div className="px-5 pb-2">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <p className="text-[8px] text-slate-600 uppercase mb-1">Dirección {config.network}</p>
                  <p className="text-[11px] text-slate-300 font-mono break-all select-all">{config.walletAddress}</p>
                </div>
              </div>
            )}

            {/* Instrucciones */}
            <div className="px-5 pb-3">
              <p className="text-[10px] text-slate-500 font-medium mb-1.5">Instrucciones:</p>
              <ol className="space-y-0.5">
                {config.instructions.map((inst, i) => (
                  <li key={i} className="text-[10px] text-slate-500 flex gap-1.5">
                    <span className="text-[#00D9FF] shrink-0">{i + 1}.</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Advertencia */}
            {config.warning && (
              <div className="mx-5 mb-3 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-400/80">{config.warning}</p>
                </div>
              </div>
            )}

            {/* Confirmación manual de pago */}
            <AnimatePresence>
              {!showConfirm ? (
                <motion.div key="confirm-btn" className="px-5 pb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-all border border-emerald-500/20 active:scale-[0.98]">
                    <Send className="w-4 h-4" />
                    YA PAGUÉ — CONFIRMAR
                  </button>
                </motion.div>
              ) : (
                <motion.div key="confirm-form" className="px-5 pb-3 space-y-2"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <p className="text-[10px] text-slate-500 font-medium">Confirma tu pago manualmente:</p>
                  <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)}
                    placeholder="ID de transacción / TX Hash (opcional)"
                    className="w-full bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { setShowConfirm(false); setTxHash(''); setConfirmStatus('idle') }}
                      className="flex-1 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 text-xs font-medium transition-all">
                      CANCELAR
                    </button>
                    <button onClick={() => {
                      const record = savePaymentRecord({ method, transactionHash: txHash || undefined, notes: `Pago ${config.label}` })
                      setActivePayment(record)
                      setConfirmStatus('saved')
                    }}
                      className="flex-1 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-all">
                      CONFIRMAR PAGO
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Estado de confirmación */}
            {confirmStatus === 'saved' && activePayment && (
              <motion.div className="mx-5 mb-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs font-medium text-emerald-400">Pago registrado</p>
                </div>
                <p className="text-[10px] text-slate-500">ID: {activePayment.id}</p>
                {activePayment.transactionHash && (
                  <p className="text-[10px] text-slate-500 font-mono truncate">TX: {activePayment.transactionHash}</p>
                )}
                <p className="text-[10px] text-slate-600 mt-1">Estado: Pendiente de verificación. Recibirás confirmación.</p>
              </motion.div>
            )}

            {/* Historial reciente */}
            {(() => {
              const last = getLastPayment(method)
              if (!last || (activePayment && last.id === activePayment.id)) return null
              return (
                <div className="mx-5 mb-3 p-2 rounded-lg bg-slate-900/40 border border-slate-800/40">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <p className="text-[10px] text-slate-500 font-medium">Último pago</p>
                  </div>
                  <p className="text-[10px] text-slate-400">{last.status === 'CONFIRMED' ? 'Confirmado' : last.status === 'VERIFIED' ? 'Verificado' : 'Pendiente'} — {new Date(last.createdAt).toLocaleDateString()}</p>
                </div>
              )
            })()}

            {/* Botones de acción */}
            <div className="px-5 pb-3 flex gap-2">
              {config.walletAddress ? (
                <button onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all active:scale-[0.98]">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'COPIADO' : 'COPIAR DATOS'}
                </button>
              ) : (
                <button disabled
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800/50 text-slate-600 text-sm font-medium cursor-not-allowed">
                  <Copy className="w-4 h-4" />
                  COPIAR DATOS
                </button>
              )}
              <button onClick={() => setExpanded(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] text-sm font-medium transition-all active:scale-[0.98]">
                <Expand className="w-4 h-4" />
                AMPLIAR QR
              </button>
            </div>

            {/* Botón volver */}
            <div className="px-5 pb-5">
              <button onClick={onBack}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-white text-xs font-medium transition-all border border-slate-800/60">
                <ArrowLeft className="w-3.5 h-3.5" />
                VOLVER
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal expandido */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Brillo exterior */}
              <div className="absolute -inset-8 bg-gradient-to-r from-[#00D9FF]/10 via-violet-500/10 to-[#00D9FF]/10 rounded-3xl blur-2xl pointer-events-none" />

              <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-[#00D9FF]/20">
                <QrCode
                  data={config.qrData}
                  size={Math.min(typeof window !== 'undefined' ? window.innerWidth - 80 : 400, 400)}
                />
              </div>

              {config.walletAddress && (
                <p className="mt-3 text-[10px] text-slate-500 font-mono max-w-[300px] truncate">{config.walletAddress}</p>
              )}

              <button onClick={() => setExpanded(false)}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all">
                <X className="w-4 h-4" /> CERRAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
