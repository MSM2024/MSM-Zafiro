'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full border-2 border-[#00D9FF] flex items-center justify-center mb-6">
        <span className="text-[#00D9FF] text-2xl">Z</span>
      </div>
      <h1 className="text-xl font-bold mb-2">Sin Conexión</h1>
      <p className="text-sm text-slate-400 text-center max-w-xs">
        ZAFIRO está funcionando en modo local.
        Los cambios se sincronizarán cuando regrese la conexión.
      </p>
    </div>
  )
}
