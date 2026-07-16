'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: number
  max?: number
}

export default function StarRating({ value, onChange, readonly = false, size = 20, max = 5 }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= (hover || value)
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            className={`${readonly ? '' : 'cursor-pointer hover:scale-110'} transition-all`}
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={`${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} transition-colors`}
            />
          </button>
        )
      })}
    </div>
  )
}
