'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getPlataformasCripto, getTotalPortafolio, actualizarActivos, syncCripto2FA, type CriptoPlataforma, type CriptoActivo } from "@/lib/cripto-activos"
import { ArrowLeft, Wallet, ExternalLink, Shield, RefreshCw, Plus, Bitcoin } from "lucide-react"

function SimboloIcon({ s }: { s: string }) {
  const colores: Record<string, string> = {
    BTC: "text-amber-400", ETH: "text-blue-400", USDT: "text-emerald-400",
    USDC: "text-blue-300", SOL: "text-purple-400", ADA: "text-cyan-400",
    DOT: "text-pink-400", MATIC: "text-indigo-500", AVAX: "text-red-400",
    LINK: "text-blue-500", UNI: "text-pink-500", ATOM: "text-purple-500",
    XRP: "text-slate-200", DOGE: "text-yellow-400", SHIB: "text-orange-400",
  }
  return <span className={colores[s] || "text-slate-400"}>{s}</span>
}

export default function AdminCriptoPage() {
  usePageTitle("Activos Digitales — ZAFIRO")
  const [plataformas, setPlataformas] = useState<CriptoPlataforma[]>([])
  const [total, setTotal] = useState(0)
  const [editActivos, setEditActivos] = useState<string | null>(null)
  const [nuevoActivo, setNuevoActivo] = useState({ simbolo: "", nombre: "", cantidad: 0, valorUSD: 0, tipo: "coin" as CriptoActivo["tipo"] })

  useEffect(() => {
    setPlataformas(getPlataformasCripto())
    setTotal(getTotalPortafolio())
  }, [])

  function handleAgregarActivo(pid: string) {
    const activo: CriptoActivo = { ...nuevoActivo, cantidad: Number(nuevoActivo.cantidad), valorUSD: Number(nuevoActivo.valorUSD) }
    if (!activo.simbolo) return
    const pf = plataformas.find((p) => p.id === pid)
    if (!pf) return
    actualizarActivos(pid, [...pf.activos, activo])
    setPlataformas(getPlataformasCripto())
    setTotal(getTotalPortafolio())
    setNuevoActivo({ simbolo: "", nombre: "", cantidad: 0, valorUSD: 0, tipo: "coin" })
  }

  function handleSync(pid: string) {
    const pf = plataformas.find((p) => p.id === pid)
    if (!pf) return
    syncCripto2FA(pid, "synced")
    setPlataformas(getPlataformasCripto())
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Panel de Administración
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-black">Activos Digitales</h1>
            <p className="text-[10px] text-slate-400">Dashboard unificado de criptomonedas</p>
          </div>
        </div>

        {/* Total portafolio */}
        <div className="p-6 rounded-2xl glass border border-slate-800/30 mb-6 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Valor Total del Portafolio</p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#00D9FF] to-purple-400">
            ${total.toFixed(2)} USD
          </p>
          <p className="text-[9px] text-slate-600 mt-1">{plataformas.length} plataformas · {plataformas.reduce((s, p) => s + p.activos.length, 0)} activos</p>
        </div>

        {/* Plataformas */}
        <div className="space-y-4">
          {plataformas.map((pf) => (
            <div key={pf.id} className="p-4 rounded-2xl glass border border-slate-800/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${pf.estadoConexion === "conectado" ? "bg-emerald-400" : "bg-amber-400"} shadow-lg ${pf.estadoConexion === "conectado" ? "shadow-emerald-400/30" : "shadow-amber-400/30"}`} />
                  <div>
                    <p className="text-sm font-bold">{pf.nombre}</p>
                    <p className="text-[9px] text-slate-500">{pf.tipo} · {pf.ultimaSync ? new Date(pf.ultimaSync).toLocaleString("es") : "Nunca"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleSync(pf.id)} className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                  </button>
                  <a href={pf.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <button onClick={() => setEditActivos(editActivos === pf.id ? null : pf.id)} className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                    <Wallet className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Activos */}
              {pf.activos.length > 0 && (
                <div className="space-y-1 mb-3">
                  {pf.activos.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-1 px-3 rounded-lg bg-slate-800/20">
                      <div className="flex items-center gap-2">
                        <SimboloIcon s={a.simbolo} />
                        <span className="text-[10px] text-slate-300">{a.nombre}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono">{a.cantidad} <span className="text-[9px] text-slate-500">{a.simbolo}</span></p>
                        <p className="text-[9px] text-slate-500">${a.valorUSD.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar activo */}
              {editActivos === pf.id && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                  <p className="text-[9px] text-slate-500 mb-2 uppercase tracking-wider">Agregar Activo</p>
                  <div className="grid grid-cols-5 gap-2">
                    <input value={nuevoActivo.simbolo} onChange={(e) => setNuevoActivo({ ...nuevoActivo, simbolo: e.target.value.toUpperCase() })} placeholder="BTC" className="col-span-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50" />
                    <input value={nuevoActivo.nombre} onChange={(e) => setNuevoActivo({ ...nuevoActivo, nombre: e.target.value })} placeholder="Bitcoin" className="col-span-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50" />
                    <input value={nuevoActivo.cantidad || ""} onChange={(e) => setNuevoActivo({ ...nuevoActivo, cantidad: parseFloat(e.target.value) || 0 })} placeholder="Cant." type="number" step="any" className="col-span-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50" />
                    <input value={nuevoActivo.valorUSD || ""} onChange={(e) => setNuevoActivo({ ...nuevoActivo, valorUSD: parseFloat(e.target.value) || 0 })} placeholder="$USD" type="number" step="any" className="col-span-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50" />
                    <button onClick={() => handleAgregarActivo(pf.id)} className="col-span-1 bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[10px] rounded-lg hover:bg-[#00D9FF]/30 transition-colors">
                      <Plus className="w-3 h-3 mx-auto text-[#00D9FF]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl glass border border-slate-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <p className="text-[10px] font-bold text-emerald-400">Protección 2FA Activa</p>
          </div>
          <p className="text-[9px] text-slate-500">
            Todas las plataformas están vinculadas al <strong className="text-slate-300">Puente de Autenticación</strong>. 
            Si un código 2FA es requerido, ELIANA te notificará al instante para que proveas el nuevo código.
          </p>
        </div>
      </div>
    </div>
  )
}
