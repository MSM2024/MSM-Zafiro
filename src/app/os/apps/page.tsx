'use client'

import { usePageTitle } from "@/lib/usePageTitle"
import Link from "next/link"
import { Diamond, MessageCircle, ShoppingBag, BookOpen, DollarSign, Globe, Users, FolderOpen, Film, Settings, Grid3X3 } from "lucide-react"

const ALL_APPS = [
  { name: "Mi Perfil", icon: Diamond, href: "/zafiro/perfil", color: "from-[#00D9FF] to-blue-600", desc: "Gestiona tu identidad y membresía", offline: true },
  { name: "ELIANA", icon: MessageCircle, href: "/eliana", color: "from-violet-500 to-purple-600", desc: "Asistente inteligente del ecosistema", offline: true },
  { name: "Marketplace", icon: ShoppingBag, href: "https://msmmystore.com", color: "from-emerald-500 to-teal-600", desc: "Compra y venta en MSM", offline: false, external: true },
  { name: "Editorial", icon: BookOpen, href: "/ecosystem", color: "from-amber-500 to-orange-600", desc: "Artículos, libros y devocionales", offline: false },
  { name: "Economía", icon: DollarSign, href: "/economia", color: "from-green-500 to-emerald-600", desc: "Caja, inventario y operaciones", offline: false },
  { name: "Universo", icon: Globe, href: "/universo", color: "from-cyan-500 to-blue-600", desc: "Explora la comunidad MSM", offline: true },
  { name: "Familia", icon: Users, href: "/familia", color: "from-pink-500 to-rose-600", desc: "Árbol genealógico y encuentros", offline: true },
  { name: "Archivos", icon: FolderOpen, href: "/dashboard", color: "from-indigo-500 to-violet-600", desc: "Tus documentos y datos", offline: true },
  { name: "Holo Cinema", icon: Film, href: "/holo-cinema", color: "from-purple-500 to-pink-600", desc: "Experiencia 3D ZAFIRO", offline: false },
  { name: "Configuración", icon: Settings, href: "/settings", color: "from-slate-500 to-slate-600", desc: "Ajustes del sistema", offline: true },
  { name: "Admin", icon: Grid3X3, href: "/admin", color: "from-red-500 to-red-600", desc: "Panel de administración", offline: false },
  { name: "La Mente Maestra", icon: Diamond, href: "/transforma-tu-vida-con-la-mente-maestra", color: "from-[#00D9FF] to-violet-600", desc: "Programa de transformación personal", offline: false },
]

export default function OsAppsPage() {
  usePageTitle("ZAFIRO OS — Aplicaciones")

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Todas las Aplicaciones</h1>
            <p className="text-xs text-slate-400">{ALL_APPS.length} aplicaciones disponibles</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_APPS.map((app, i) => {
            const Icon = app.icon
            const Tag = app.external ? 'a' : Link
            const props = app.external ? { href: app.href, target: "_blank", rel: "noopener noreferrer" } : { href: app.href }
            return (
              <Tag key={i} {...props}
                className="p-4 rounded-2xl glass glass-hover group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">{app.name}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{app.desc}</p>
                <span className={`inline-block mt-2 text-[8px] px-1.5 py-0.5 rounded-full ${app.offline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {app.offline ? 'Offline' : 'Online'}
                </span>
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}
