import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-4xl text-white/30">📡</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Sin conexión</h1>
        <p className="text-white/50 mb-8 max-w-md">
          No tienes conexión a internet. Las preguntas guardadas localmente siguen disponibles.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium inline-block"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  )
}
