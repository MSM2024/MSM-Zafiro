'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { useParams, useRouter } from 'next/navigation'
import { getCircle, joinCircle, leaveCircle, getCircleCover } from '@/lib/circles'
import { getSession } from '@/lib/auth'
import { getFeed } from '@/lib/feed'
import { 
  Users, Globe, Lock, Calendar, ChevronLeft, UserPlus, UserMinus, 
  MessageSquare, ThumbsUp, Trash2, Shield, ShieldOff, UserX 
} from 'lucide-react'

export default function CirclePage() {
  usePageTitle('Círculo — ZAFIRO')
  const { circleId } = useParams<{ circleId: string }>()
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [refreshKey, setRefreshKey] = useState(0)

  const circle = getCircle(circleId)
  if (!circle) {
    return (
      <div className="min-h-screen bg-[#050816] text-white p-4">
        <div className="max-w-3xl mx-auto text-center py-16">
          <p className="text-slate-400">Círculo no encontrado</p>
          <Link href="/circulos" className="text-[#00D9FF] text-sm hover:underline mt-2 inline-block">← Volver</Link>
        </div>
      </div>
    )
  }

  const userId = session?.email || ''
  const isMember = circle.members.includes(userId)
  const isModerator = circle.moderators.includes(userId)
  const isOwner = circle.authorId === userId

  const handleJoin = () => {
    if (!session) return
    if (joinCircle(circleId, userId)) setRefreshKey(k => k + 1)
  }

  const handleLeave = () => {
    if (!session) return
    if (leaveCircle(circleId, userId)) setRefreshKey(k => k + 1)
  }

  const circlePosts = getFeed().posts.filter(p => p.circleId === circleId && !p.blocked)

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/circulos" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-4 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Volver a círculos
        </Link>

        <div className={`h-24 rounded-xl bg-gradient-to-r ${circle.coverColor} opacity-40 mb-0`} />
        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 md:p-6 -mt-6 relative mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${circle.coverColor} flex items-center justify-center text-2xl font-bold shadow-lg mb-3`}>
            {circle.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold">{circle.name}</h1>
              <p className="text-sm text-slate-300 mt-1">{circle.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Creado {new Date(circle.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{circle.members.length} miembros</span>
                <span className="flex items-center gap-1">{circle.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}{circle.visibility === 'public' ? 'Público' : 'Privado'}</span>
                <span>Por {circle.authorName}</span>
              </div>
              {circle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {circle.tags.map(t => (
                    <span key={t} className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/5 px-2 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {!session ? (
                <Link href="/auth/login" className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Unirse
                </Link>
              ) : isMember ? (
                <button onClick={handleLeave} className="flex items-center gap-1.5 bg-red-400/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-400/20 transition-colors">
                  <UserMinus className="w-3.5 h-3.5" /> Salir
                </button>
              ) : (
                <button onClick={handleJoin} className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Unirse
                </button>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="mt-4 pt-4 border-t border-[#1A1B3A]">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">Miembros ({circle.members.length})</h3>
            <div className="flex flex-wrap gap-2">
              {circle.members.slice(0, 20).map(m => (
                <span key={m} className="text-[10px] bg-[#1A1B3A] text-slate-300 px-2 py-1 rounded-full flex items-center gap-1">
                  {m === circle.authorId && <Shield className="w-2.5 h-2.5 text-amber-400" />}
                  {circle.moderators.includes(m) && !(m === circle.authorId) && <ShieldOff className="w-2.5 h-2.5 text-[#00D9FF]" />}
                  {m.split('@')[0] || m.slice(0, 8)}
                </span>
              ))}
              {circle.members.length > 20 && (
                <span className="text-[10px] text-slate-500 px-2 py-1">+{circle.members.length - 20} más</span>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Publicaciones ({circlePosts.length})</h2>
        {circlePosts.length === 0 ? (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 text-center">
            <MessageSquare className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No hay publicaciones en este círculo aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {circlePosts.map(p => (
              <div key={p.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white">{p.authorName}</span>
                  <span className="text-[9px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-300">{p.text}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{p.likes.length}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
