'use client'

import { useState } from 'react'
import { Image, Send, X } from 'lucide-react'
import { createPost } from '@/lib/feed'
import { getSession } from '@/lib/auth'

export default function FeedComposer({ onPublished }: { onPublished?: () => void }) {
  const [text, setText] = useState('')
  const [tags, setTags] = useState('')
  const [posting, setPosting] = useState(false)
  const session = typeof window !== 'undefined' ? getSession() : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !session || posting) return
    setPosting(true)
    createPost({
      authorId: session.email || '',
      authorName: session.name || session.email || 'Usuario',
      text: text.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setText('')
    setTags('')
    setPosting(false)
    onPublished?.()
  }

  if (!session) {
    return (
      <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-center">
        <p className="text-xs text-slate-500">Inicia sesión para publicar</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="¿Qué estás pensando, {session.name?.split(' ')[0] || 'Zafiro'}?"
        rows={3} maxLength={2000}
        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none"
      />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1B3A]/50">
        <div className="flex items-center gap-2">
          <button type="button" className="text-slate-500 hover:text-[#00D9FF] transition-colors" title="Imagen (próximamente)">
            <Image className="w-4 h-4" />
          </button>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (opcional, separados por coma)" maxLength={100}
            className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1 text-[10px] text-slate-300 placeholder:text-slate-600 w-48 focus:outline-none focus:border-[#00D9FF]/50"
          />
        </div>
        <button type="submit" disabled={!text.trim() || posting}
          className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 transition-colors disabled:opacity-30">
          <Send className="w-3 h-3" /> Publicar
        </button>
      </div>
    </form>
  )
}
