'use client'

import { useState, type FormEvent } from "react"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { trackMMEvent } from "@/lib/mente-maestra/analytics"

interface Props {
  onSuccess?: () => void
}

export default function LeadForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ name: '', email: '', country: '', whatsapp: '', interest: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const validate = () => {
    if (!form.name.trim()) return 'El nombre es obligatorio'
    if (!form.email.trim()) return 'El correo electrónico es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Correo electrónico inválido'
    if (!form.country.trim()) return 'El país es obligatorio'
    if (!form.interest.trim()) return 'Selecciona tu interés principal'
    if (!form.consent) return 'Debes aceptar el consentimiento'
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) { setErrorMsg(error); setStatus('error'); return }
    setStatus('loading'); setErrorMsg('')
    try {
      const res = await fetch('/api/mente-maestra/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
          medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
          referral: document.referrer || '',
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar')
      }
      const leadData = await res.json()
      // Persistir lead localmente para el admin panel
      try {
        const key = 'zafiro_mente_maestra_leads'
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        existing.unshift({
          id: leadData.leadId || crypto.randomUUID(),
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.whatsapp || '',
          source: 'La Mente Maestra',
          consent: true,
          status: 'new',
          createdAt: new Date().toISOString(),
          notes: `Interés: ${form.interest}, País: ${form.country}`,
        })
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 1000)))
      } catch { /* silent */ }
      setStatus('success')
      trackMMEvent('waitlist_submit')
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Error de conexión')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 rounded-2xl glass text-center">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">¡Registro exitoso!</h3>
        <p className="text-slate-400 text-sm">Gracias por tu interés. Te mantendremos informado sobre el programa La Mente Maestra.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Nombre *</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
            placeholder="Tu nombre" required />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Correo electrónico *</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
            placeholder="tu@correo.com" required />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">País *</label>
          <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
            placeholder="Ej: Cuba, Estados Unidos" required />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">WhatsApp (opcional)</label>
          <input type="tel" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
            placeholder="+1 234 567 8900" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Interés principal *</label>
        <select value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50 transition-colors" required>
          <option value="" className="bg-[#050816]">Selecciona...</option>
          <option value="crecimiento-personal" className="bg-[#050816]">Crecimiento personal</option>
          <option value="emprendimiento" className="bg-[#050816]">Emprendimiento</option>
          <option value="habitos" className="bg-[#050816]">Hábitos y disciplina</option>
          <option value="proposito" className="bg-[#050816]">Propósito y visión</option>
          <option value="comunidad" className="bg-[#050816]">Comunidad MAESTRA</option>
          <option value="fe" className="bg-[#050816]">Fe y fundamento</option>
        </select>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
          className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#00D9FF] focus:ring-[#00D9FF]/30" />
        <span className="text-xs text-slate-500">Acepto que mis datos sean utilizados para recibir información sobre el programa La Mente Maestra y el ecosistema MSM. Puedo solicitar la eliminación en cualquier momento.</span>
      </label>
      <input type="text" name="_hp" className="absolute opacity-0 h-0 w-0" tabIndex={-1} autoComplete="off" />
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {status === 'loading' ? 'ENVIANDO...' : 'UNIRME A LA LISTA DE ESPERA'}
      </button>
    </form>
  )
}
