'use client'

import Link from "next/link"
import { ArrowLeft, Send, Search, MoreHorizontal, Phone, Video, Plus } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { PageShell } from "@/components/ui/PageShell"
import { getSession } from "@/lib/auth"
import {
  getUserConversations, getConversationMessages, sendMessage, markConversationRead,
  getOrCreateConversation, type Conversation, type Message,
} from "@/lib/messages"

export default function MessagesPage() {
  usePageTitle("Mensajes")
  const session = typeof window !== "undefined" ? getSession() : null
  const userId = session?.email || ""
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeConvId, setActiveConvId] = useState<string>("")
  const [msg, setMsg] = useState("")
  const [search, setSearch] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const convs = getUserConversations(userId)
  const activeConv = convs.find(c => c.id === activeConvId) || null
  const messages = activeConvId ? getConversationMessages(activeConvId) : []

  useEffect(() => {
    if (activeConvId && userId) {
      markConversationRead(activeConvId, userId)
      setRefreshKey(k => k + 1)
    }
  }, [activeConvId, userId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const filteredConvs = convs.filter(c => {
    if (!search) return true
    const s = search.toLowerCase()
    return Object.values(c.participantNames).some(n => n.toLowerCase().includes(s))
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim() || !activeConvId || !session) return
    sendMessage(activeConvId, session.email || "", session.name || "Usuario", msg.trim())
    setMsg("")
    setRefreshKey(k => k + 1)
  }

  const getOtherParticipant = (conv: Conversation) => {
    const otherId = conv.participants.find(p => p !== userId)
    if (!otherId) return { id: "", name: "Desconocido" }
    return { id: otherId, name: conv.participantNames[otherId] || otherId }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    return d.toLocaleDateString()
  }

  return (
    <PageShell className="p-0">
      <div className="h-screen flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 shrink-0">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-black flex-1">Mensajes</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              className="w-40 bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-slate-800 overflow-y-auto shrink-0 hidden md:block">
            {filteredConvs.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                {search ? "No se encontraron conversaciones" : "No tienes conversaciones aún"}
              </div>
            ) : filteredConvs.map(c => {
              const other = getOtherParticipant(c)
              return (
                <button key={c.id} onClick={() => setActiveConvId(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left cursor-pointer ${
                    activeConvId === c.id ? "bg-[#00D9FF]/10 border-l-2 border-[#00D9FF]" : "hover:bg-slate-900/40 border-l-2 border-transparent"
                  }`}>
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-sm font-black shrink-0">
                    {other.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{other.name}</p>
                      <span className="text-[8px] text-slate-500 shrink-0">{c.lastMessageTime ? formatTime(c.lastMessageTime) : ''}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {c.lastSenderId === userId ? 'Tú: ' : ''}{c.lastMessage || 'Sin mensajes'}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#00D9FF] text-[7px] font-black text-[#050816] flex items-center justify-center shrink-0">{c.unreadCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex-1 flex flex-col">
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-500">Selecciona una conversación</p>
                  <p className="text-xs text-slate-600 mt-1">o busca un perfil para iniciar un chat</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-xs font-black">
                      {getOtherParticipant(activeConv).name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs font-bold">{getOtherParticipant(activeConv).name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-slate-500">No hay mensajes aún. Envía el primero.</p>
                    </div>
                  ) : messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-2xl text-xs max-w-[75%] ${
                        m.senderId === userId
                          ? "bg-gradient-to-r from-[#00D9FF]/20 to-blue-600/20 border border-[#00D9FF]/20 text-white"
                          : "bg-slate-900/60 border border-slate-800 text-slate-200"
                      }`}>
                        <p>{m.text}</p>
                        <p className="text-[8px] text-slate-500 mt-1 text-right">{formatTime(m.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2">
                  <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#00D9FF] outline-none" />
                  <button type="submit" disabled={!msg.trim()}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 flex items-center justify-center disabled:opacity-50 cursor-pointer">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
