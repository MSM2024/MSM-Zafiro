'use client'

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show || dismissed) return null

  const handleInstall = () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null)
      setShow(false)
    })
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-[#0A0B1A] border border-[#00D9FF]/20 rounded-xl p-4 shadow-2xl shadow-[#00D9FF]/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Instala ZAFIRO</p>
            <p className="text-xs text-slate-400 mt-0.5">Accede rápido desde tu pantalla de inicio</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={handleInstall}
                className="px-4 py-1.5 rounded-lg bg-[#00D9FF] text-black text-xs font-bold hover:bg-[#00D9FF]/90 transition-colors">
                Instalar
              </button>
              <button onClick={() => { setDismissed(true); setShow(false) }}
                className="text-xs text-slate-500 hover:text-white transition-colors px-2 py-1.5">
                Ahora no
              </button>
            </div>
          </div>
          <button onClick={() => setShow(false)} className="text-slate-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
