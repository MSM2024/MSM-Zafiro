'use client'

import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

const EVENTOS = [
  { periodo: "Generación fundadora", titulo: "Bisabuelos Martínez y Sablón", descripcion: "Jutilino Martínez y Emilia Torres · Severino Sablón y Susa Moraga — las raíces del linaje materno.", tipo: "raíces" },
  { periodo: "Generación de los abuelos", titulo: "Joaquín Soria Macías y Celia Macías Chacón", descripcion: "Abuelos paternos — fundadores de la rama Soria Macías.", tipo: "raíces" },
  { periodo: "Generación de los abuelos", titulo: "Luis Martínez Torres y Cruz María Sablón Moraga", descripcion: "Abuelos maternos — unión de las familias Martínez y Sablón.", tipo: "raíces" },
  { periodo: "Los hijos", titulo: "Rama Soria Macías", descripcion: "Aquilino Pascual (Nano), Daniel (Chino), Marciano, Ana Amparo y Osvaldo.", tipo: "descendencia" },
  { periodo: "Los hijos", titulo: "Rama Martínez Sablón", descripcion: "Elia, Reinerio, Nildo, Luis, Ofelia y Marbelina.", tipo: "descendencia" },
  { periodo: "2026", titulo: "Nacimiento de Villa Esperanza", descripcion: "Primera comunidad modelo bajo la Constitución Renacer — viviendas sostenibles, energía solar y centro tecnológico.", tipo: "legado" },
  { periodo: "16 de Agosto de 2026", titulo: "Gran Encuentro Familiar", descripcion: "Finca Las Siete Vueltas — todas las generaciones reunidas para honrar las raíces y sellar el legado.", tipo: "encuentro" },
]

const TIPO_COLORS: Record<string, string> = {
  "raíces": "border-[#D6A83A] bg-[#D6A83A]/10 text-[#D6A83A]",
  descendencia: "border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF]",
  legado: "border-[#2F6B45] bg-[#2F6B45]/10 text-[#4ade80]",
  encuentro: "border-[#7C3AED] bg-[#7C3AED]/10 text-[#a78bfa]",
}

export default function CronologiaPage() {
  usePageTitle("Cronología Familiar")

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        <div className="text-center mb-10">
          <CalendarDays className="w-10 h-10 text-[#D6A83A] mx-auto mb-3" />
          <h1 className="text-2xl md:text-4xl font-bold">Cronología Familiar</h1>
          <p className="text-zinc-400 mt-2">De los bisabuelos a las generaciones actuales</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#D6A83A] via-[#00D9FF] to-[#7C3AED]" />
          <div className="space-y-8">
            {EVENTOS.map((e, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-[#D6A83A] border-2 border-[#050816]" />
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide border ${TIPO_COLORS[e.tipo]}`}>
                  {e.periodo}
                </span>
                <h3 className="font-semibold text-lg mt-2">{e.titulo}</h3>
                <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{e.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-12">
          Los eventos con fechas exactas (nacimientos, matrimonios) se agregarán cuando la familia confirme los datos.
          <br />ELIANA nunca inventa fechas — solo registra lo confirmado.
        </p>
      </div>
    </div>
  )
}
