'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRandomSeal } from '@/lib/seals-data'

export default function RandomSealRedirect() {
  const router = useRouter()
  useEffect(() => {
    const seal = getRandomSeal()
    if (seal) router.replace(`/sellos/${seal.numero}`)
    else router.replace('/sellos')
  }, [router])
  return null
}
