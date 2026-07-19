'use client'

import { useState } from 'react'
import { ThumbsUp, Sparkles, Copy, Volume2, Send, MessageSquare } from 'lucide-react'
import { recordFeedback } from '@/lib/eliana/feedback'

type Props = {
  messageId: string
  messageText: string
  responseText: string
}

export default function ResponseActionBar({ messageId, messageText, responseText }: Props) {
  const [feedback, setFeedback] = useState<Record<string, boolean>>({})

  const actions = [
    { id: 'like' as const, icon: ThumbsUp, label: 'Me gusta', color: 'text-emerald-400' },
    { id: 'improve' as const, icon: Sparkles, label: 'Mejorar', color: 'text-amber-400' },
    { id: 'copy' as const, icon: Copy, label: 'Copiar', color: 'text-blue-400' },
    { id: 'listen' as const, icon: Volume2, label: 'Escuchar', color: 'text-purple-400' },
    { id: 'send' as const, icon: Send, label: 'Enviar', color: 'text-[#00D9FF]' },
  ]

  const handleAction = (actionId: string) => {
    if (actionId === 'like') {
      setFeedback(prev => ({ ...prev, [messageId]: !prev[messageId] }))
      recordFeedback(messageId, 'like', messageText, responseText)
    }
    if (actionId === 'improve') {
      const comment = prompt('¿Qué mejorarías de esta respuesta?')
      if (comment) {
        recordFeedback(messageId, 'improve', messageText, responseText, comment)
      }
    }
    if (actionId === 'copy') {
      navigator.clipboard.writeText(responseText)
    }
    if (actionId === 'listen') {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(responseText)
        utterance.lang = 'es-ES'
        speechSynthesis.speak(utterance)
      }
    }
    if (actionId === 'send') {
      const shareData = { title: 'ELIANA - ZAFIRO', text: responseText }
      if (navigator.share) {
        navigator.share(shareData)
      } else {
        navigator.clipboard.writeText(responseText)
      }
    }
  }

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-700/30">
      {actions.map(({ id, icon: Icon, label, color }) => (
        <button
          key={id}
          onClick={() => handleAction(id)}
          title={label}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-mono transition-all cursor-pointer ${
            id === 'like' && feedback[messageId]
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <Icon className={`w-3 h-3 ${id === 'like' && feedback[messageId] ? color : ''}`} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
