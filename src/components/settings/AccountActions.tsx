'use client'

import { useState } from 'react'
import { LogOut, Trash2, AlertTriangle, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { getOfflineStatus } from '@/lib/settings/sync'

interface Props {
  userName: string
}

export default function AccountActions({ userName }: Props) {
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'reauth' | 'phrase' | 'done'>('confirm')
  const [deleteMessage, setDeleteMessage] = useState('')

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const handleRequestDelete = () => {
    const offline = getOfflineStatus()
    if (offline) {
      setDeleteMessage('Se requiere conexión para eliminar la cuenta.')
      return
    }
    if (confirmText !== 'ELIMINAR MI CUENTA') {
      setDeleteMessage('Escribe exactamente "ELIMINAR MI CUENTA" para confirmar.')
      return
    }
    setDeleteStep('done')
    setDeleteMessage('Solicitud de eliminación recibida. Período de revisión: 30 días. Recibirás un correo para cancelar si lo deseas.')
    setTimeout(() => {
      setShowDelete(false)
      setConfirmText('')
      setDeleteStep('confirm')
      setDeleteMessage('')
    }, 5000)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Cuenta</h2>

      <button onClick={handleLogout}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer group">
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5 text-rose-400" />
          <div className="text-left">
            <p className="text-sm font-bold text-rose-400">Cerrar Sesión</p>
            <p className="text-xs text-slate-400">{userName}</p>
          </div>
        </div>
        <span className="text-xs text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">Cerrar →</span>
      </button>

      <button onClick={() => setShowDelete(true)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer group">
        <div className="flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-red-400" />
          <div className="text-left">
            <p className="text-sm font-bold text-red-400">Eliminar Cuenta</p>
            <p className="text-xs text-slate-400">Esta acción requiere verificación</p>
          </div>
        </div>
        <span className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Eliminar →</span>
      </button>

      {/* Modal de Eliminación */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#050816] border border-red-500/30 shadow-2xl shadow-red-500/10">
            {deleteStep === 'done' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Solicitud Recibida</h3>
                <p className="text-xs text-slate-400">{deleteMessage}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-lg font-bold text-white">Eliminar Cuenta</h3>
                  </div>
                  <button onClick={() => { setShowDelete(false); setConfirmText(''); setDeleteMessage('') }} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-400">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="font-bold text-red-400 mb-1">Consecuencias:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Tu perfil y contenido dejarán de ser visibles</li>
                      <li>Los registros legales y financieros se conservan según política</li>
                      <li>Pedidos y comprobantes requeridos no se eliminan</li>
                      <li>Periodo de revisión: 30 días antes de la eliminación</li>
                      <li>Puedes cancelar la solicitud dentro de este período</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="font-bold text-amber-400 mb-1">Se conserva por obligación legal:</p>
                    <p>Auditorías, operaciones financieras, pedidos, facturación y comprobantes requeridos por ley.</p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      Escribe <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-red-400 font-mono">ELIMINAR MI CUENTA</kbd> para confirmar:
                    </label>
                    <input type="text" value={confirmText} placeholder="ELIMINAR MI CUENTA"
                      onChange={e => setConfirmText(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-500 outline-none mt-1" />
                    {deleteMessage && <p className="text-[10px] text-red-400 mt-1">{deleteMessage}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setShowDelete(false); setConfirmText(''); setDeleteMessage('') }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer transition-all">
                      Cancelar
                    </button>
                    <button onClick={handleRequestDelete}
                      disabled={confirmText !== 'ELIMINAR MI CUENTA'}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> Solicitar Eliminación
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
