'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getAssets, updateAssetStatus, getBrandColors } from '@/lib/marketing'
import type { MarketingAsset } from '@/lib/marketing'
import { Image, Video, Palette, Sparkles, Globe, Smartphone, Camera, Film, CheckCircle, Clock, AlertTriangle, Tag, Share2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const platformIcons: Record<string, LucideIcon> = { whatsapp: Smartphone, telegram: Globe, facebook: Globe, instagram: Camera, web: Globe, all: Share2 }
const typeIcons: Record<string, LucideIcon> = { sticker: Sparkles, video: Film, image: Image, brand_kit: Palette }

export default function MarketingPage() {
  usePageTitle('Marketing — Admin ZAFIRO')

  const [assets, setAssets] = useState<MarketingAsset[]>(() => getAssets())
  const [tab, setTab] = useState('assets')
  const colors = getBrandColors()

  const refresh = () => setAssets(getAssets())

  const byPlatform = (p: string) => assets.filter(a => a.platform === p || a.platform === 'all')

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-[#00D9FF] bg-clip-text text-transparent">
            Marketing — Mayarí Arriba
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Activos promocionales del ecosistema MSM</p>
        </div>

        <div className="flex gap-1 border-b border-[#1A1B3A]">
          {['assets', 'brand_kit'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px ${tab === t ? 'text-[#00D9FF] border-[#00D9FF]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
              {t === 'assets' ? 'Activos' : 'Kit de Marca'}</button>
          ))}
        </div>

        {tab === 'assets' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
                <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300">{assets.filter(a => a.type === 'sticker').length}</p>
                <p className="text-[10px] text-slate-500">Stickers</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
                <Film className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300">{assets.filter(a => a.type === 'video').length}</p>
                <p className="text-[10px] text-slate-500">Videos</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
                <Image className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300">{assets.filter(a => a.type === 'image').length}</p>
                <p className="text-[10px] text-slate-500">Imágenes</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
                <Palette className="w-5 h-5 text-[#00D9FF] mx-auto mb-1" />
                <p className="text-xs text-slate-300">{assets.filter(a => a.type === 'brand_kit').length}</p>
                <p className="text-[10px] text-slate-500">Kit de Marca</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300">{assets.filter(a => a.status === 'ready' || a.status === 'published').length}</p>
                <p className="text-[10px] text-slate-500">Publicados</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(a => {
                const TypeIcon = typeIcons[a.type] || Image
                const PlatformIcon = platformIcons[a.platform] || Globe
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl overflow-hidden">
                    <div className="h-28 bg-gradient-to-br from-amber-400/5 to-[#00D9FF]/5 flex items-center justify-center border-b border-[#1A1B3A]">
                      <div className="text-center">
                        <TypeIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                        <p className="text-[10px] text-slate-600">Preview próximamente</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-semibold text-white truncate">{a.name}</h3>
                        <div className="flex items-center gap-1">
                          <PlatformIcon className="w-3 h-3 text-slate-500" />
                          <button onClick={() => {
                            const next = a.status === 'draft' ? 'ready' : a.status === 'ready' ? 'published' : 'draft'
                            updateAssetStatus(a.id, next as any)
                            refresh()
                          }}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              a.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                              a.status === 'ready' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-slate-500/10 text-slate-400'
                            }`}>{a.status}</button>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">{a.description}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 bg-[#050816] px-1.5 py-0.5 rounded">{a.format}</span>
                        <span className="text-[10px] text-slate-500 bg-[#050816] px-1.5 py-0.5 rounded">{a.platform}</span>
                        {a.tags.map(t => <span key={t} className="text-[10px] text-[#00D9FF]/60 bg-[#00D9FF]/5 px-1.5 py-0.5 rounded">#{t}</span>)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {tab === 'brand_kit' && (
          <div className="space-y-6">
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#00D9FF]" /> Colores de Marca
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {colors.map((c: { name: string; hex: string; usage: string }) => (
                  <div key={c.hex} className="bg-[#050816] rounded-lg p-3 border border-[#1A1B3A]">
                    <div className="w-full h-10 rounded-lg mb-2" style={{ backgroundColor: c.hex }} />
                    <p className="text-xs font-mono text-white">{c.hex}</p>
                    <p className="text-[10px] text-slate-400">{c.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{c.usage}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Tipografía</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>Geist Bold — Títulos</p>
                    <p className="text-xs text-slate-400">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="text-xs text-slate-400">abcdefghijklmnopqrstuvwxyz</p>
                  </div>
                  <div>
                    <p className="text-sm text-white" style={{ fontFamily: 'Geist, sans-serif' }}>Geist Regular — Cuerpo</p>
                    <p className="text-xs text-slate-400">El ecosistema MSM está compuesto por 4 pilares fundamentales.</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>Monospace — Código y datos</p>
                    <p className="text-[10px] text-slate-500">ledger_entry: {`{ amount: 100, currency: 'USD' }`}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Reglas de Marca</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Usar azul zafiro (#00D9FF) como color principal de acento
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Fondos oscuros (#050816) — mantener alto contraste
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    No usar afirmaciones financieras engañosas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Incluir MSM o ZAFIRO según contexto
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Optimizar archivos para móvil
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Mantener alta legibilidad en todos los formatos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
