"use client"

import { useState } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { ZAFIRO_ASSETS } from "@/config/zafiro-assets"

const ASSET_ENTRIES = Object.entries(ZAFIRO_ASSETS).map(([key, val]) => ({
  id: key,
  src: val.src,
  alt: val.alt,
  width: val.width,
  height: val.height,
  usage: val.usage,
}))

const CATEGORIES = ["branding", "avatars", "conceptos", "storyboards"] as const

function getCategory(id: string): string {
  if (id.includes("storyboard")) return "storyboards"
  if (id.includes("dashboard") || id.includes("incubadora")) return "conceptos"
  if (id.includes("avatar") || id.includes("eliana")) return "avatars"
  return "branding"
}

export default function VisualPreviewPage() {
  usePageTitle("Visual Preview — ZAFIRO")
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all" ? ASSET_ENTRIES : ASSET_ENTRIES.filter((a) => getCategory(a.id) === filter)

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#00D9FF] via-blue-500 to-purple-400 bg-clip-text text-transparent">
            ZAFIRO — Galería Visual
          </h1>
          <p className="text-sm text-slate-400 mt-2">15 imágenes · Preview del nuevo sistema visual</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === "all" ? "bg-[#00D9FF] text-[#050816]" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>Todas</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${filter === cat ? "bg-[#00D9FF] text-[#050816]" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="group relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/30 hover:border-[#00D9FF]/30 transition-all">
              <div className="aspect-[3/4] overflow-hidden bg-slate-900/50">
                <img
                  src={asset.src}
                  alt={asset.alt}
                  width={asset.width}
                  height={asset.height}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-mono text-[#00D9FF] uppercase tracking-wider">{getCategory(asset.id)}</span>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{asset.usage}</p>
                <p className="text-[9px] text-slate-600 mt-1 font-mono truncate">{asset.width}×{asset.height}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl border border-slate-800 bg-slate-900/20">
          <h2 className="text-sm font-bold text-slate-400 mb-2">Diseño actual — respaldado en</h2>
          <code className="text-xs text-slate-500 font-mono">backups/pre-zafiro-visual/</code>
          <p className="text-xs text-slate-600 mt-2">Aprobación necesaria antes de integrar al diseño activo.</p>
        </div>
      </div>
    </div>
  )
}
