'use client'

import Link from "next/link"
import { ArrowLeft, LogOut, WifiOff, CheckCircle, Clock, Database } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession, logout } from "@/lib/auth"
import { getProfile } from "@/lib/profile"
import { useRouter } from "next/navigation"
import type { SettingsSection, UIState, UserPreferences } from "@/lib/settings/types"
import { loadPreferences, savePreferences, onPreferencesChanged } from "@/lib/settings/storage"
import { applyAllTheme } from "@/lib/settings/theme-manager"
import { getOfflineStatus, syncPreferencesToBackend } from "@/lib/settings/sync"
import SettingsNavigation from "@/components/settings/SettingsNavigation"
import ProfileSettings from "@/components/settings/ProfileSettings"
import AppearanceSettings from "@/components/settings/AppearanceSettings"
import NotificationSettings from "@/components/settings/NotificationSettings"
import PrivacySettings from "@/components/settings/PrivacySettings"
import LanguageRegionSettings from "@/components/settings/LanguageRegionSettings"
import SecuritySettings from "@/components/settings/SecuritySettings"
import AccessibilitySettings from "@/components/settings/AccessibilitySettings"
import AudioVoiceSettings from "@/components/settings/AudioVoiceSettings"
import AccountActions from "@/components/settings/AccountActions"

export default function SettingsPage() {
  usePageTitle("Configuración")
  const router = useRouter()
  const sessionUser = getSession()
  const userId = sessionUser?.id || sessionUser?.email || "anonymous"

  const [activeSection, setActiveSection] = useState<SettingsSection>('perfil')
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadPreferences(userId))
  const [uiState, setUiState] = useState<UIState>('idle')
  const [uiMessage, setUiMessage] = useState('')
  const [offline, setOffline] = useState(false)
  const [syncPending, setSyncPending] = useState(false)

  const profile = getProfile(userId)

  useEffect(() => {
    setOffline(getOfflineStatus())
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    const unsub = onPreferencesChanged(() => setPrefs(loadPreferences(userId)))
    return unsub
  }, [userId])

  useEffect(() => { applyAllTheme(prefs) }, [])

  const handlePrefChange = useCallback((field: string, value: unknown) => {
    const updated = { ...prefs, [field]: value, updatedAt: new Date().toISOString() } as UserPreferences
    setPrefs(updated)
    savePreferences(updated)

    if (field === 'themeMode' || field === 'accentColor' || field === 'customAccentColor' ||
        field === 'compactMode' || field === 'fontScale' || field === 'motionPreference') {
      applyAllTheme(updated)
    }

    const isOffline = getOfflineStatus()
    setOffline(isOffline)
    if (isOffline) {
      setUiState('sync_pending')
      setUiMessage('Guardado en este dispositivo. Se sincronizará al recuperar conexión.')
      setSyncPending(true)
    } else {
      setUiState('saved')
      setUiMessage('Preferencias guardadas.')
    }
    setTimeout(() => { setUiState('idle'); setUiMessage('') }, 3000)
  }, [prefs, userId])

  const handleSync = async () => {
    setUiState('saving')
    const result = await syncPreferencesToBackend(userId)
    if (result.ok) {
      setUiState('saved')
      setUiMessage('Cambios sincronizados.')
      setSyncPending(false)
    } else {
      setUiState('error')
      setUiMessage(result.error || 'Error de sincronización.')
    }
    setTimeout(() => { setUiState('idle'); setUiMessage('') }, 3000)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'perfil':
        return <ProfileSettings userId={userId} profile={profile} />
      case 'apariencia':
        return <AppearanceSettings {...prefs} onChange={(f, v) => handlePrefChange(f, v)} />
      case 'notificaciones':
        return <NotificationSettings value={prefs.notifications} onChange={v => handlePrefChange('notifications', v)} />
      case 'privacidad':
        return <PrivacySettings value={prefs.privacy} onChange={v => handlePrefChange('privacy', v)} />
      case 'idioma':
        return <LanguageRegionSettings value={prefs.languageRegion} onChange={v => handlePrefChange('languageRegion', v)} />
      case 'seguridad':
        return <SecuritySettings value={prefs.security} onChange={v => handlePrefChange('security', v)} userId={userId} />
      case 'accesibilidad':
        return <AccessibilitySettings value={prefs.accessibility} onChange={v => handlePrefChange('accessibility', v)} />
      case 'audio':
        return <AudioVoiceSettings value={prefs.audioVoice} onChange={v => handlePrefChange('audioVoice', v)} />
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Configuración</h1>
          <div className="flex items-center gap-2">
            {offline && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                <WifiOff className="w-3 h-3" /> Sin conexión
              </span>
            )}
            {syncPending && (
              <button onClick={handleSync}
                className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg hover:bg-amber-500/20 cursor-pointer transition-all">
                <Database className="w-3 h-3" /> Sincronizar pendientes
              </button>
            )}
            {uiState === 'saved' && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <CheckCircle className="w-3 h-3" /> {uiMessage}
              </span>
            )}
            {uiState === 'sync_pending' && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" /> Pendiente de sincronización
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          <div>
            <SettingsNavigation active={activeSection} onChange={setActiveSection}>
              <hr className="border-slate-800 my-3" />
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
                <LogOut className="w-4 h-4" /> Cerrar Sesión {sessionUser && `(${sessionUser.name})`}
              </button>
              <AccountActions userName={sessionUser?.name || 'Usuario'} />
            </SettingsNavigation>
          </div>

          <div className="p-6 rounded-2xl glass">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}
