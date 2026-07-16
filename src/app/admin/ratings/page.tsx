'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Star, Search, MessageSquare, TrendingUp, Users, ShoppingBag } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getAllRatings, getSellerSummary, type Rating } from "@/lib/ratings"

export default function AdminRatingsPage() {
  usePageTitle("Calificaciones — Admin ZAFIRO")
  const router = useRouter()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  useEffect(() => { setRatings(getAllRatings()) }, [])

  const stats = useMemo(() => ({
    total: ratings.length,
    average: ratings.length ? Math.round((ratings.reduce((a, r) => a + r.stars, 0) / ratings.length) * 10) / 10 : 0,
    fiveStars: ratings.filter(r => r.stars === 5).length,
    responded: ratings.filter(r => r.responded).length,
  }), [ratings])

  const filtered = useMemo(() => {
    return ratings.filter(r =>
      !search || r.orderId.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [ratings, search])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Calificaciones</h1>
            <p className="text-[10px] font-mono text-slate-500">Reputación y experiencia del cliente — Admin ZAFIRO</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-3 mb-8">
          <div className="p-3 rounded-2xl glass">
            <Star className="w-4 h-4 text-amber-400 mb-1.5" />
            <p className="text-lg font-black">{stats.average}</p>
            <p className="text-[8px] text-slate-400">Promedio general</p>
          </div>
          <div className="p-3 rounded-2xl glass">
            <ShoppingBag className="w-4 h-4 text-blue-400 mb-1.5" />
            <p className="text-lg font-black">{stats.total}</p>
            <p className="text-[8px] text-slate-400">Total calificaciones</p>
          </div>
          <div className="p-3 rounded-2xl glass">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-1.5" />
            <p className="text-lg font-black">{stats.fiveStars}</p>
            <p className="text-[8px] text-slate-400">5 estrellas</p>
          </div>
          <div className="p-3 rounded-2xl glass">
            <MessageSquare className="w-4 h-4 text-purple-400 mb-1.5" />
            <p className="text-lg font-black">{stats.responded}</p>
            <p className="text-[8px] text-slate-400">Respondidas</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl glass">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Buscar por orden o comentario..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-2xl glass text-center">
              <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-[10px] text-slate-500">No hay calificaciones aún</p>
            </div>
          ) : filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="p-4 rounded-2xl glass">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white">Orden #{r.orderId.slice(-6)}</span>
                    <span className="text-[7px] text-slate-500">{new Date(r.createdAt).toLocaleString("es")}</span>
                    {r.responded && <span className="text-[7px] text-emerald-400">✓ Respondida</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={12} className={i < r.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
                    ))}
                    <span className="text-[8px] text-slate-400">Entrega: {r.deliveryRating}/5</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{r.comment}</p>
                  {r.responseComment && (
                    <div className="mt-2 p-2 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/10">
                      <p className="text-[8px] text-[#00D9FF] font-bold">Respuesta del vendedor:</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{r.responseComment}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
