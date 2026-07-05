'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { getVotes, setVote } from '@/lib/data'

export function VoteButtons({ targetId, initialScore = 0 }: { targetId: string; initialScore?: number }) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState(0)

  useEffect(() => {
    const votes = getVotes()
    setUserVote(votes[targetId] || 0)
  }, [targetId])

  const handleVote = (value: number) => {
    const oldVote = userVote
    const newVote = oldVote === value ? 0 : value
    const diff = newVote - oldVote
    setScore((s) => s + diff)
    setUserVote(newVote)
    setVote(targetId, value)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        className={`p-1.5 rounded-lg transition-colors ${
          userVote === 1
            ? 'text-emerald-400 bg-emerald-400/10'
            : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-400/10'
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      <span className={`text-sm font-mono tabular-nums ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-white/50'}`}>
        {score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        className={`p-1.5 rounded-lg transition-colors ${
          userVote === -1
            ? 'text-red-400 bg-red-400/10'
            : 'text-white/30 hover:text-red-400 hover:bg-red-400/10'
        }`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  )
}
