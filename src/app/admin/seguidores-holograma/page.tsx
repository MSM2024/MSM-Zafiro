'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import HolographicFollowersScene from "@/components/admin/followers/HolographicFollowersScene"
import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"

const ALLOWED_ROLES = ['OWNER_SUPERADMIN', 'ADMIN', 'ANALYTICS_VIEWER']

export default function SeguidoresHologramaPage() {
  usePageTitle("ZAFIRO Followers Universe — Admin")
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session || !ALLOWED_ROLES.includes(session.role || '')) {
      router.replace('/')
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver a Admin
          </Link>
        </div>
        <HolographicFollowersScene />
      </div>
    </div>
  )
}
