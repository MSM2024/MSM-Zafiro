'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  Users,
  MessageCircle,
  Flag,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Ban,
} from 'lucide-react'

const STATS = [
  { label: 'Usuarios totales', value: '12,847', change: '+12%', icon: Users, color: 'text-indigo-400 bg-indigo-500/20' },
  { label: 'Preguntas', value: '3,421', change: '+8%', icon: MessageCircle, color: 'text-cyan-400 bg-cyan-500/20' },
  { label: 'Reportes abiertos', value: '7', change: '-3%', icon: Flag, color: 'text-rose-400 bg-rose-500/20' },
  { label: 'IA generadas', value: '1,892', change: '+24%', icon: Activity, color: 'text-emerald-400 bg-emerald-500/20' },
]

const PENDING_REPORTS = [
  { id: 'r1', type: 'Spam', target: 'Pregunta: "Gana dinero rápido"', reporter: 'Ana M.', time: '15m', status: 'pending' },
  { id: 'r2', type: 'Lenguaje inapropiado', target: 'Respuesta en "¿Qué es..."', reporter: 'Carlos R.', time: '1h', status: 'pending' },
  { id: 'r3', type: 'Contenido duplicado', target: 'Pregunta sobre RAG', reporter: 'Sistema', time: '3h', status: 'reviewing' },
]

const RECENT_ACTIONS = [
  { action: 'Usuario baneado', target: 'user_2341', moderator: 'Admin', time: '30m' },
  { action: 'Pregunta eliminada', target: 'Spam: "Compra..."', moderator: 'ELIANA', time: '1h' },
  { action: 'Respuesta validada', target: 'Por experto: Dr. Ruiz', moderator: 'Sistema', time: '2h' },
  { action: 'Insignia otorgada', target: 'Colaborador a Elena G.', moderator: 'Sistema', time: '4h' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'reports' | 'users' | 'content'>('overview')

  const tabs = [
    { id: 'overview' as const, label: 'Panel', icon: BarChart3 },
    { id: 'reports' as const, label: 'Reportes', icon: Flag },
    { id: 'users' as const, label: 'Usuarios', icon: Users },
    { id: 'content' as const, label: 'Contenido', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-400" />
              Admin Panel
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            7 reportes pendientes
          </span>
        </div>

        <nav className="flex items-center gap-2 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                  tab === t.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            )
          })}
        </nav>

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={
                        stat.change.startsWith('+') ? 'text-emerald-400 text-xs font-medium' : 'text-rose-400 text-xs font-medium'
                      }>{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-white/40 text-sm">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Reportes pendientes
                </h2>
                <div className="space-y-3">
                  {PENDING_REPORTS.map((report) => (
                    <div key={report.id} className="flex items-start justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/20 text-rose-300">{report.type}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            report.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                          }`}>{report.status}</span>
                        </div>
                        <p className="text-white text-sm">{report.target}</p>
                        <p className="text-white/30 text-xs mt-1">Reportado por {report.reporter} · {report.time}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Aprobar">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors" title="Rechazar">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-white/40 hover:text-white/70 transition-colors" title="Ver">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Actividad reciente
                </h2>
                <div className="space-y-3">
                  {RECENT_ACTIONS.map((action, i) => (
                    <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="text-white text-sm">{action.action}</p>
                        <p className="text-white/40 text-xs">{action.target}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white/40 text-xs">{action.moderator}</p>
                        <p className="text-white/30 text-xs">{action.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'reports' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Todos los reportes</h2>
            <p className="text-white/40">Interfaz de gestión de reportes con filtros por tipo, estado y moderador.</p>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Gestión de usuarios</h2>
            <p className="text-white/40">Búsqueda, filtros y acciones sobre usuarios (banear, verificar, asignar rol).</p>
          </div>
        )}

        {tab === 'content' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Gestión de contenido</h2>
            <p className="text-white/40">Revisión de preguntas, respuestas y comentarios reportados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
