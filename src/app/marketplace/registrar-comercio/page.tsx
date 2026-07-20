'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { registerStore } from '@/lib/marketplace-stores'
import { ChevronLeft, Store, ShieldCheck } from 'lucide-react'

export default function RegistrarComercioPage() {
  usePageTitle('Registrar Comercio — MSM Marketplace')
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [form, setForm] = useState({
    name: '', description: '', phone: '', address: '', website: '', category: 'General', tags: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !session) return
    registerStore({
      name: form.name.trim(), description: form.description.trim(),
      ownerId: session.email || '', ownerName: session.name || 'Usuario',
      email: session.email || '', phone: form.phone || undefined,
      address: form.address || undefined, website: form.website || undefined,
      category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setSubmitted(true)
  }

  if (!session) return (
    <div className="min-h-screen bg-[#050816] text-white p-4 flex items-center justify-center">
      <div className="text-center"><p className="text-slate-400">Inicia sesión para registrar un comercio</p>
        <Link href="/auth/login" className="text-[#00D9FF] text-sm hover:underline mt-2 inline-block">Ir a login</Link></div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-[#050816] text-white p-4 flex items-center justify-center">
      <div className="text-center max-w-md">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold mb-2">Comercio Registrado</h2>
        <p className="text-sm text-slate-400 mb-4">Tu solicitud ha sido recibida. Un administrador revisará la información para verificar tu comercio.</p>
        <Link href="/marketplace" className="text-[#00D9FF] text-sm hover:underline">Volver al Marketplace</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Volver al Marketplace
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Registrar Comercio</h1>
            <p className="text-xs text-slate-400">Vende tus productos en MSM Marketplace</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre del comercio *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={100}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} maxLength={500}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Teléfono</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D9FF]/50">
                {["General", "Alimentos", "Tecnología", "Ropa", "Hogar", "Servicios", "Arte"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dirección</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Sitio web</label>
              <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tags (coma)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
            </div>
          </div>
          <button type="submit" disabled={!form.name.trim()}
            className="w-full bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
            Registrar Comercio
          </button>
        </form>
      </div>
    </div>
  )
}
