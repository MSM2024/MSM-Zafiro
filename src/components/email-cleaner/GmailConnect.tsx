'use client'

import { useState } from "react"
import { Mail, Link2, Link2Off, Loader2, CheckCircle, AlertCircle, Key } from "lucide-react"
import type { GmailAccount } from "@/lib/email-cleaner/types"

interface Props {
  account: GmailAccount
  onStatusChange: (id: string, status: GmailAccount['status']) => void
}

export default function GmailConnect({ account, onStatusChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [showManualStep, setShowManualStep] = useState(false)
  const [error, setError] = useState('')

  const isConnected = account.status === 'CONNECTED'

  const handleConnect = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/email-cleaner/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error de conexión')

      if (data.authUrl && data.authUrl.includes('pending')) {
        setShowManualStep(true)
      } else if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=700')
      }
      onStatusChange(account.id, 'CONNECTING')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar')
      onStatusChange(account.id, 'ERROR')
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async () => {
    setLoading(true)
    try {
      await fetch('/api/email-cleaner/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.id }),
      })
      onStatusChange(account.id, 'DISCONNECTED')
      setShowManualStep(false)
    } catch {
      setError('Error al revocar')
    } finally {
      setLoading(false)
    }
  }

  const handleManualConfirm = () => {
    onStatusChange(account.id, 'CONNECTED')
    setShowManualStep(false)
  }

  return (
    <div className="p-5 rounded-2xl glass border border-slate-800/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isConnected ? 'bg-emerald-500/20 text-emerald-400' :
            account.status === 'ERROR' ? 'bg-red-500/20 text-red-400' :
            'bg-slate-800 text-slate-500'
          }`}>
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{account.email}</p>
            <p className={`text-xs ${
              isConnected ? 'text-emerald-400' :
              account.status === 'ERROR' ? 'text-red-400' :
              account.status === 'CONNECTING' ? 'text-amber-400' :
              'text-slate-500'
            }`}>
              {isConnected ? 'Conectado' :
               account.status === 'ERROR' ? 'Error' :
               account.status === 'CONNECTING' ? 'Conectando...' :
               'Desconectado'}
            </p>
          </div>
        </div>
        {isConnected ? (
          <button onClick={handleRevoke} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
            Revocar
          </button>
        ) : (
          <button onClick={handleConnect} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-medium transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            Conectar
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-3">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {showManualStep && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-400 mb-1">Autenticación manual requerida</p>
              <p className="text-xs text-slate-400 mb-3">
                Serás redirigido a Google. Introduce tu <strong className="text-white">contraseña</strong> y <strong className="text-white">código 2FA</strong> manualmente.
                ELIANA nunca almacena ni solicita estas credenciales dentro del código.
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside mb-3">
                <li>Serás redirigido a Google.</li>
                <li>Inicia sesión con tu correo.</li>
                <li>Introduce tu contraseña manualmente.</li>
                <li>Introduce tu código 2FA desde tu dispositivo.</li>
                <li>Autoriza los permisos solicitados.</li>
                <li>Vuelve a ZAFIRO y confirma.</li>
              </ol>
              <button onClick={handleManualConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all">
                <CheckCircle className="w-3 h-3 inline mr-1" /> Confirmar conexión
              </button>
            </div>
          </div>
        </div>
      )}

      {isConnected && account.connectedAt && (
        <p className="text-[10px] text-slate-600 mt-2">
          Conectado desde: {new Date(account.connectedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
