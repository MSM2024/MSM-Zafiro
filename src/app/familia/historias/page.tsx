'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, PenLine, X } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

interface FamilyStory {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

const STORIES_KEY = "zafiro_family_stories"

export default function HistoriasPage() {
  usePageTitle("Historias Familiares")
  const [stories, setStories] = useState<FamilyStory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", author: "" })

  useEffect(() => {
    setStories(JSON.parse(localStorage.getItem(STORIES_KEY) || "[]"))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    const newStory: FamilyStory = {
      id: `story-${Date.now()}`,
      ...form,
      author: form.author || "Anónimo familiar",
      createdAt: new Date().toISOString(),
    }
    const updated = [newStory, ...stories]
    setStories(updated)
    localStorage.setItem(STORIES_KEY, JSON.stringify(updated))
    setShowForm(false)
    setForm({ title: "", content: "", author: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#D6A83A]" /> Historias Familiares
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Memorias de los mayores, preservadas para siempre</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D6A83A] text-[#111827] font-medium text-sm hover:bg-[#D6A83A]/90"
          >
            <PenLine className="w-4 h-4" /> Escribir
          </button>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aún no hay historias registradas.</p>
            <p className="text-sm mt-1">Escribe la primera memoria de la familia Soria Martínez.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map(s => (
              <article key={s.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="font-semibold text-lg">{s.title}</h2>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                <div className="text-xs text-zinc-500 mt-4">
                  — {s.author} · {new Date(s.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </article>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0a1128] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Nueva Historia</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Título de la historia" value={form.title} required
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                <textarea placeholder="Cuenta la historia... (recuerdos de la finca, anécdotas de los abuelos, tradiciones familiares)"
                  value={form.content} required rows={6}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                <input type="text" placeholder="Tu nombre" value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D6A83A] text-[#111827] font-semibold">
                  Guardar Historia
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
