'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getDevocional, seedEditorial } from "@/lib/editorial"
import type { Devocional } from "@/lib/editorial/types"
import DevocionalReader from "@/components/editorial/DevocionalReader"
import { usePageTitle } from "@/lib/usePageTitle"

export default function DevocionalDetailPage() {
  const params = useParams()
  const [dev, setDev] = useState<Devocional | undefined>(undefined)

  useEffect(() => {
    seedEditorial()
    if (params.devocionalId) setDev(getDevocional(params.devocionalId as string))
  }, [params.devocionalId])

  usePageTitle(dev ? `${dev.title} — MSM Editorial` : "Devocional — MSM Editorial")

  if (!dev) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-sm text-slate-500">Devocional no encontrado</p>
      </div>
    )
  }

  return <DevocionalReader devocional={dev} />
}
