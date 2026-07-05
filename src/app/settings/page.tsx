'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  CreditCard,
  Key,
  LogOut,
  Save,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'language', label: 'Idioma', icon: Globe },
  { id: 'privacy', label: 'Privacidad', icon: Shield },
  { id: 'security', label: 'Seguridad', icon: Key },
  { id: 'billing', label: 'Facturación', icon: CreditCard },
] as const

type TabId = (typeof TABS)[number]['id']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    displayName: 'Ana Martínez',
    username: 'ana.martinez',
    bio: 'Investigadora en IA. Apasionada por el conocimiento abierto.',
    email: 'ana@ejemplo.com',
    language: 'es',
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    privateProfile: false,
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Configuración</h1>

        <div className="flex gap-8">
          <nav className="w-56 shrink-0 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-colors mt-8">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </nav>

          <div className="flex-1 min-w-0">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Información del perfil</h2>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                      AM
                    </div>
                    <div>
                      <p className="text-white font-medium">Foto de perfil</p>
                      <p className="text-white/40 text-sm">PNG, JPG. Máximo 2MB.</p>
                      <button className="text-indigo-400 text-sm hover:text-indigo-300 mt-1 transition-colors">
                        Cambiar foto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Nombre público</label>
                      <input
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Nombre de usuario</label>
                      <input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Biografía</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors min-h-[100px] resize-y"
                      maxLength={500}
                    />
                    <span className="text-xs text-white/30">{form.bio.length}/500</span>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Preferencias de notificaciones</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Notificaciones por email', desc: 'Recibe resúmenes y alertas importantes por correo' },
                      { id: 'pushNotifications', label: 'Notificaciones push', desc: 'Notificaciones en tiempo real en el navegador' },
                      { id: 'weeklyDigest', label: 'Resumen semanal', desc: 'Un email semanal con lo más destacado' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={form[item.id as keyof typeof form] as boolean}
                          onChange={(e) => setForm({ ...form, [item.id]: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/5 accent-indigo-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Apariencia</h2>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Tema</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'dark', label: 'Oscuro', icon: '🌙' },
                        { id: 'light', label: 'Claro', icon: '☀️' },
                        { id: 'system', label: 'Sistema', icon: '💻' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setForm({ ...form, theme: t.id })}
                          className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                            form.theme === t.id
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{t.icon}</span>
                          <span className="text-sm">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Idioma</h2>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Idioma de la interfaz</label>
                    <select
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors"
                    >
                      <option value="es" className="bg-[#0a0420]">Español</option>
                      <option value="en" className="bg-[#0a0420]">English</option>
                      <option value="pt" className="bg-[#0a0420]">Português</option>
                      <option value="fr" className="bg-[#0a0420]">Français</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Privacidad</h2>
                  <label className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">Perfil privado</p>
                      <p className="text-white/40 text-xs mt-0.5">Solo tú y tus seguidores pueden ver tu perfil</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.privateProfile}
                      onChange={(e) => setForm({ ...form, privateProfile: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 accent-indigo-500"
                    />
                  </label>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Seguridad</h2>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-indigo-300 text-sm font-medium mb-1">Autenticación de dos factores</p>
                    <p className="text-white/40 text-sm">Añade una capa extra de seguridad a tu cuenta.</p>
                    <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:opacity-90 transition-opacity">
                      Configurar 2FA
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-300 text-sm font-medium mb-1">Sesiones activas</p>
                    <p className="text-white/40 text-sm">Hay 2 sesiones activas en tu cuenta.</p>
                    <button className="mt-3 px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors">
                      Cerrar otras sesiones
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Facturación</h2>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-white text-sm font-medium mb-1">Plan actual</p>
                    <p className="text-white/60 text-sm mb-3">Estás en el plan Free</p>
                    <Link
                      href="/membership"
                      className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
                    >
                      Ver planes disponibles
                    </Link>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-white text-sm font-medium mb-1">Método de pago</p>
                    <p className="text-white/40 text-sm">No hay método de pago registrado.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                  ) : saved ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guardado</>
                  ) : (
                    <><Save className="w-4 h-4" /> Guardar cambios</>
                  )}
                </button>
                <Link
                  href="/"
                  className="px-4 py-2.5 text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
