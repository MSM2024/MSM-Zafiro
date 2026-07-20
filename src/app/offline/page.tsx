'use client'

import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSyncStatus } from "@/lib/offline-queue"
import { useEffect, useState } from "react"

export default function OfflinePage() {
  usePageTitle("Sin Conexión — ZAFIRO")
  const [status, setStatus] = useState<ReturnType<typeof getSyncStatus> | null>(null)

  useEffect(() => {
    setStatus(getSyncStatus())
    const interval = setInterval(() => setStatus(getSyncStatus()), 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full border-2 border-[#00D9FF] flex items-center justify-center mb-6">
        <span className="text-[#00D9FF] text-2xl">Z</span>
      </div>
      <h1 className="text-xl font-bold mb-2">Sin Conexión</h1>
      <p className="text-sm text-slate-400 text-center max-w-xs mb-6">
        ZAFIRO está funcionando en modo local.
        Los cambios se sincronizarán cuando regrese la conexión.
      </p>

      {status && (status.pendingCount > 0 || status.failedCount > 0) && (
        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl px-4 py-3 mb-6 text-center">
          <p className="text-xs text-amber-400">{status.pendingCount} operación(es) pendiente(s) de sincronización</p>
          {status.failedCount > 0 && (
            <p className="text-xs text-red-400 mt-1">{status.failedCount} operación(es) fallaron</p>
          )}
        </div>
      )}

      <Link href="/admin/sync"
        className="text-xs text-[#00D9FF] hover:text-white transition-colors border border-[#00D9FF]/20 hover:border-[#00D9FF]/40 px-4 py-2 rounded-lg">
        Estado de Sincronización
      </Link>
    </div>
  )
}
