'use client'

import { useState } from "react"
import { motion } from "motion/react"
import { Shield, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import type { ClassificationRule } from "@/lib/email-cleaner/types"
import { DEFAULT_TRUSTED_DOMAINS, DEFAULT_TRUSTED_EMAILS } from "@/lib/email-cleaner/types"

interface Props {
  rules: ClassificationRule[]
  trustedDomains: string[]
  trustedEmails: string[]
  onToggleRule: (id: string) => void
  onDeleteRule: (id: string) => void
  onAddTrustedDomain: (domain: string) => void
  onRemoveTrustedDomain: (domain: string) => void
}

export default function ClassificationRules({ rules, trustedDomains, trustedEmails, onToggleRule, onDeleteRule, onAddTrustedDomain, onRemoveTrustedDomain }: Props) {
  const [newDomain, setNewDomain] = useState('')

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase()
    if (domain && !trustedDomains.includes(domain)) {
      onAddTrustedDomain(domain)
      setNewDomain('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00D9FF]" /> Remitentes Confiables
        </h2>
        <div className="p-5 rounded-2xl glass border border-slate-800/60">
          <p className="text-xs text-slate-500 mb-4">
            Estos dominios y correos <strong className="text-emerald-400">nunca</strong> se moverán a Spam automáticamente.
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Dominios</p>
            <div className="flex flex-wrap gap-2">
              {trustedDomains.map((domain, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                  <Shield className="w-3 h-3" /> {domain}
                  <button onClick={() => onRemoveTrustedDomain(domain)} className="hover:text-red-400 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Correos</p>
            <div className="flex flex-wrap gap-2">
              {trustedEmails.map((email, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">
                  <Shield className="w-3 h-3" /> {email}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" value={newDomain} onChange={e => setNewDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddDomain()}
              placeholder="Agregar dominio..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50" />
            <button onClick={handleAddDomain}
              className="px-3 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-medium transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Reglas de Clasificación</h2>
        {rules.length === 0 ? (
          <div className="p-5 rounded-2xl glass border border-slate-800/60 text-center">
            <p className="text-xs text-slate-500">No hay reglas personalizadas. Las reglas por defecto están activas.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rules.map(rule => (
              <div key={rule.id} className="p-4 rounded-2xl glass border border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{rule.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${rule.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {rule.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onToggleRule(rule.id)} className="text-slate-400 hover:text-white transition-colors">
                    {rule.active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => onDeleteRule(rule.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
