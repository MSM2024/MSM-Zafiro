'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Trash2, Flag, Share2, MoreHorizontal, Send } from 'lucide-react'
import type { FeedPost as FeedPostType } from '@/lib/feed'
import { toggleLike, addComment, deletePost, reportPost } from '@/lib/feed'
import { getSession } from '@/lib/auth'

export default function FeedPost({ post, onUpdate }: { post: FeedPostType; onUpdate?: () => void }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const session = typeof window !== 'undefined' ? getSession() : null
  const userId = session?.email || ''

  const isLiked = post.likes.includes(userId)
  const isAuthor = post.authorId === userId

  const handleLike = () => {
    toggleLike(post.id, userId)
    onUpdate?.()
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session) return
    addComment(post.id, { authorId: userId, authorName: session.name || userId, text: commentText.trim() })
    setCommentText('')
    onUpdate?.()
  }

  const handleDelete = () => {
    if (!isAuthor) return
    deletePost(post.id, userId)
    onUpdate?.()
  }

  const handleReport = () => {
    const reason = prompt('Motivo del reporte:')
    if (reason) reportPost(post.id, reason)
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'ahora'
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    const days = Math.floor(hrs / 24)
    return `${days}d`
  }

  return (
    <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-[#00D9FF]">
            {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.authorName}</p>
            <p className="text-[10px] text-slate-500">{timeAgo(post.createdAt)}{post.visibility !== 'public' ? ' · 🔒' : ''}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-500 hover:text-white p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg shadow-xl z-20 py-1">
                {isAuthor && (
                  <button onClick={handleDelete} className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[#1A1B3A]/50">Eliminar</button>
                )}
                <button onClick={handleReport} className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:bg-[#1A1B3A]/50">Reportar</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-200 whitespace-pre-wrap mb-3">{post.text}</p>
      {post.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {post.tags.map(t => (
            <span key={t} className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/5 px-2 py-0.5 rounded-full">#{t}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-[#1A1B3A]/50">
        <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400' : ''}`} /> {post.likes.length}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#00D9FF] transition-colors">
          <MessageCircle className="w-3.5 h-3.5" /> {post.comments.length}
        </button>
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Compartir
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-[#1A1B3A]/50 space-y-2">
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-[#00D9FF]">
                {c.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-[#050816] rounded-lg px-3 py-1.5">
                <p className="font-medium text-white text-[11px]">{c.authorName}</p>
                <p className="text-slate-300">{c.text}</p>
              </div>
            </div>
          ))}
          {session && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Escribe un comentario..." maxLength={500}
                className="flex-1 bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
              />
              <button type="submit" disabled={!commentText.trim()} className="text-[#00D9FF] disabled:opacity-30">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
