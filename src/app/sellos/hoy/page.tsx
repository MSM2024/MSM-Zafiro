'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTodaySeal, setTodaySeal, getReadingPlan, getProgress, getPublishedSeals } from '@/lib/seals-data'

export default function TodaySealRedirect() {
  const router = useRouter()
  useEffect(() => {
    const todayId = getTodaySeal()

    if (todayId !== null) {
      router.replace(`/sellos/${todayId}`)
      return
    }

    // Si tiene plan de lectura, usa el próximo sello
    const plan = getReadingPlan()
    if (plan && plan.currentSeal > 0) {
      router.replace(`/sellos/${plan.currentSeal}`)
      return
    }

    // Último sello no completado
    const progress = getProgress()
    const incomplete = progress.filter(p => p.status !== 'completed')
    if (incomplete.length > 0) {
      const next = incomplete[0]
      router.replace(`/sellos/${next.sealId}`)
      return
    }

    // Primer sello disponible
    const published = getPublishedSeals()
    if (published.length > 0) {
      router.replace(`/sellos/${published[0].numero}`)
      return
    }

    router.replace('/sellos')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
      <p className="text-zinc-500">Preparando el sello de hoy...</p>
    </div>
  )
}
