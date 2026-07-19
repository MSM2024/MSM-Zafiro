'use client'

import { useState } from "react"

type AvatarProps = {
  src?: string | null
  alt: string
  name?: string
  size?: number
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const COLORS = [
  "bg-[#00D9FF]", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-purple-500", "bg-pink-500", "bg-red-500", "bg-indigo-500",
]

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Avatar({ src, alt, name = alt, size = 40, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white text-sm font-bold ${getColor(name)} ${className}`}
        style={{ width: size, height: size }}
        title={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  )
}
