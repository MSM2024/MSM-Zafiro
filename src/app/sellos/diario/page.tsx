'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Bookmark, ArrowLeft, Trash2, BookOpen, Search } from 'lucide-react'
import Link from 'next/link'
import { getJournal, deleteJournalEntry, getSealByNumber, type JournalEntry } from '@/lib/seals-data'
import { usePageTitle } from '@/lib/usePageTitle'

export default function JournalPage() {
  usePageTitle('Mi Diario Espiritual — ZAFIRO')

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setEntries(getJournal().reverse())
  }, [])

  const handleDelete = (id: string) => {
    deleteJournalEntry(id)
    setEntries(entries.filter(e => e.id !== id))
  }

  const filtered = search
    ? entries.filter(e => e.content.toLowerCase().includes(search.toLowerCase()))
    : entries

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sellos" className="text-zinc-500 hover:text-[#00D9FF]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-[#00D9FF]" /> Mi Diario Espiritual
            </h1>
            <p className="text-sm text-zinc-500">{entries.length} notas personales</p>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en tus notas..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
            <h2 className="text-xl font-semibold mb-2">Diario vacío</h2>
            <p className="text-zinc-500 mb-6">Tus notas espirituales aparecerán aquí.</p>
            <Link href="/sellos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 rounded-xl hover:bg-[#00D9FF]/30 transition-all">
              <BookOpen className="w-4 h-4" /> Abrir un sello
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map(entry => {
            const seal = getSealByNumber(entry.sealId)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/sellos/${entry.sealId}`} className="text-xs text-[#00D9FF] hover:underline">
                    Sello #{entry.sealId}{seal ? ` — ${seal.tema}` : ''}
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                <p className="text-xs text-zinc-600 mt-3">
                  {new Date(entry.createdAt).toLocaleDateString('es-ES', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
