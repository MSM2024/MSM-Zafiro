'use client'

import { useState } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getAllExportData, toCSV, toJSON, type ExportSection } from "@/lib/export"
import { Download, FileSpreadsheet, FileJson, Database, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const PILLAR_COLORS: Record<string, string> = {
  marketplace: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  editorial: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  economy: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  identity: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  sellos: "text-violet-400 border-violet-500/20 bg-violet-500/10",
}

export default function AdminExportPage() {
  usePageTitle("Exportar Datos — Admin ZAFIRO")
  const [sections] = useState<ExportSection[]>(() => getAllExportData())
  const [expanded, setExpanded] = useState<string | null>(null)
  const [format, setFormat] = useState<"csv" | "json">("csv")

  const totalRows = sections.reduce((s, sec) => s + sec.rows.length, 0)

  const downloadAll = () => {
    const parts: string[] = []
    for (const sec of sections) {
      if (sec.rows.length === 0) continue
      const header = `--- ${sec.name} (${sec.pillar}) ---`
      const data = format === "csv" ? toCSV(sec.rows) : toJSON(sec.rows)
      parts.push(header + "\n" + data)
    }
    const content = parts.join("\n\n")
    const ext = format === "csv" ? "csv" : "json"
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zafiro-export-${new Date().toISOString().slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSection = (sec: ExportSection) => {
    if (sec.rows.length === 0) return
    const content = format === "csv" ? toCSV(sec.rows) : toJSON(sec.rows)
    const ext = format === "csv" ? "csv" : "json"
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zafiro-${sec.name.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Exportar Datos</h1>
              <p className="text-xs text-slate-400">{totalRows} registros en {sections.length} tablas — Imperio MSM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl overflow-hidden border border-slate-700">
              <button onClick={() => setFormat("csv")}
                className={`px-3 py-1.5 text-[10px] font-bold transition-all ${format === "csv" ? "bg-[#00D9FF]/20 text-[#00D9FF]" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                CSV
              </button>
              <button onClick={() => setFormat("json")}
                className={`px-3 py-1.5 text-[10px] font-bold transition-all ${format === "json" ? "bg-[#00D9FF]/20 text-[#00D9FF]" : "bg-slate-900/60 text-slate-400 hover:text-white"}`}>
                JSON
              </button>
            </div>
            <button onClick={downloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-all">
              <Download className="w-3.5 h-3.5" /> Exportar Todo
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sections.map(sec => {
            const isExpanded = expanded === sec.name
            const colorClass = PILLAR_COLORS[sec.pillar] || "text-slate-400 border-slate-500/20 bg-slate-500/10"
            return (
              <div key={sec.name} className="rounded-xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
                <button onClick={() => setExpanded(isExpanded ? null : sec.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${colorClass}`}>
                      {sec.pillar}
                    </span>
                    <span className="text-sm font-bold text-white">{sec.name}</span>
                    <span className="text-[10px] text-slate-500">({sec.rows.length} registros)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); downloadSection(sec) }}
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-emerald-400 transition-all">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {isExpanded && sec.rows.length > 0 && (
                  <div className="px-4 pb-4 overflow-x-auto">
                    <table className="w-full text-[9px] font-mono">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          {Object.keys(sec.rows[0]).map(h => (
                            <th key={h} className="px-2 py-1 text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.rows.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                            {Object.values(row).map((v, j) => (
                              <td key={j} className="px-2 py-1 text-slate-300 truncate max-w-[150px]">{v}</td>
                            ))}
                          </tr>
                        ))}
                        {sec.rows.length > 10 && (
                          <tr><td colSpan={Object.keys(sec.rows[0]).length} className="px-2 py-2 text-slate-500 text-center italic">
                            ... y {sec.rows.length - 10} registros más
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {isExpanded && sec.rows.length === 0 && (
                  <div className="px-4 pb-4 text-[10px] text-slate-500">Sin datos</div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-500">
            Datos exportados desde localStorage. {totalRows} registros totales en {sections.length} tablas.
          </p>
          <Link href="/admin" className="text-[9px] text-[#00D9FF] hover:underline mt-1 inline-block">
            ← Volver al Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
