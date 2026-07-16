'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Heart, BookOpen, ArrowLeft, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'
import SealCard from '@/components/sellos/SealCard'
import { getFavorites, getSealByNumber, toggleFavorite, getProgress, type Seal } from '@/lib/seals-data'
import { usePageTitle } from '@/lib/usePageTitle'

export default function FavoritesPage() {
  usePageTitle('Mis Sellos Favoritos — ZAFIRO')

  const [favorites, setFavs] = useState<number[]>([])
  const [seals, setSeals] = useState<Seal[]>([])
  const [progress, setProgress] = useState(getProgress())

  useEffect(() => {
    const favs = getFavorites()
    setFavs(favs)
    setSeals(favs.map(id => getSealByNumber(id)).filter(Boolean) as Seal[])
  }, [])

  const refresh = () => {
    const favs = getFavorites()
    setFavs(favs)
    setSeals(favs.map(id => getSealByNumber(id)).filter(Boolean) as Seal[])
    setProgress(getProgress())
  }

  const handleRemove = (id: number) => {
    toggleFavorite(id)
    refresh()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sellos" className="text-zinc-500 hover:text-[#00D9FF]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-400" /> Mis Sellos Favoritos
            </h1>
            <p className="text-sm text-zinc-500">{favorites.length} sellos guardados</p>
          </div>
        </div>

        {seals.length === 0 && (
          <div className="text-center py-20">
            <Star className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
            <h2 className="text-xl font-semibold mb-2">Aún no tienes favoritos</h2>
            <p className="text-zinc-500 mb-6">Guardra sellos para tenerlos siempre a mano.</p>
            <Link href="/sellos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 rounded-xl hover:bg-[#00D9FF]/30 transition-all">
              <BookOpen className="w-4 h-4" /> Explorar sellos
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seals.map(seal => (
            <div key={seal.numero} className="relative group">
              <Link href={`/sellos/${seal.numero}`}>
                <SealCard seal={seal} isFav={true} />
              </Link>
              <button
                onClick={() => handleRemove(seal.numero)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
