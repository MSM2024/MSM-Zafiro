'use client'

import { useState, useCallback } from 'react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getFeed, getFeedStats } from '@/lib/feed'
import FeedPost from '@/components/FeedPost'
import FeedComposer from '@/components/FeedComposer'
import { MessageCircle, TrendingUp } from 'lucide-react'

export default function FeedPage() {
  usePageTitle('Feed — ZAFIRO')
  const [refreshKey, setRefreshKey] = useState(0)
  const [tab, setTab] = useState<'feed' | 'trending'>('feed')

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const { posts, total } = getFeed(undefined, 0, 50)
  const stats = getFeedStats()

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
            Feed Social
          </h1>
          <div className="flex items-center gap-1 bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg p-0.5">
            <button onClick={() => setTab('feed')} className={`px-3 py-1 rounded-md text-xs ${tab === 'feed' ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-500 hover:text-white'}`}>
              <MessageCircle className="w-3 h-3 inline mr-1" />Feed
            </button>
            <button onClick={() => setTab('trending')} className={`px-3 py-1 rounded-md text-xs ${tab === 'trending' ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-500 hover:text-white'}`}>
              <TrendingUp className="w-3 h-3 inline mr-1" />Tendencias
            </button>
          </div>
        </div>

        {tab === 'feed' && (
          <div className="space-y-4">
            <FeedComposer onPublished={refresh} key={`composer-${refreshKey}`} />
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl">
                <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No hay publicaciones aún</p>
                <p className="text-xs text-slate-500 mt-1">¡Sé el primero en publicar!</p>
              </div>
            ) : (
              posts.map(p => (
                <FeedPost key={`${p.id}-${refreshKey}`} post={p} onUpdate={refresh} />
              ))
            )}
          </div>
        )}

        {tab === 'trending' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Estadísticas del Feed</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#00D9FF]">{stats.totalPosts}</p>
                <p className="text-[10px] text-slate-400">Publicaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.totalLikes}</p>
                <p className="text-[10px] text-slate-400">Reacciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.totalComments}</p>
                <p className="text-[10px] text-slate-400">Comentarios</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">{total} publicaciones en total</p>
          </div>
        )}
      </div>
    </div>
  )
}
