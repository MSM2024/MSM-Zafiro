export type ThemeMode = 'system' | 'light' | 'dark'
export type AccentColorName = 'zafiro' | 'cian' | 'violeta' | 'dorado' | 'esmeralda' | 'rubi' | 'rosa' | 'naranja' | 'plata' | 'custom'
export type FontScale = 'pequena' | 'normal' | 'grande' | 'muy-grande'
export type MotionPreference = 'completo' | 'reducido' | 'sistema'
export type Language = 'es' | 'en'
export type NotificationChannel = 'in-app' | 'email' | 'whatsapp' | 'push'
export type NotificationCategory =
  | 'sistema' | 'comunidad' | 'mensajes' | 'marketplace'
  | 'editorial' | 'economia' | 'seguridad' | 'eliana' | 'promociones'

export interface NotificationSettings {
  categories: Record<NotificationCategory, boolean>
  channels: Record<NotificationChannel, boolean>
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
  frequency: 'inmediata' | 'resumen-diario' | 'semanal'
}

export interface PrivacySettings {
  profilePublic: boolean
  whoCanFollow: 'todos' | 'verificados' | 'nadie'
  whoCanMessage: 'todos' | 'seguidores' | 'nadie'
  showActivity: boolean
  showBusiness: boolean
  showPosts: boolean
  allowElianaPersonalization: boolean
  allowAnalytics: boolean
  allowCommunications: boolean
}

export interface LanguageRegionSettings {
  language: Language
  country: string
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '24h' | '12h'
  currency: string
  decimalSeparator: ',' | '.'
  readingDirection: 'ltr' | 'rtl'
}

export interface SecuritySettings {
  mfaEnabled: boolean
  mfaVerified: boolean
  recoveryCodesGenerated: boolean
  loginAlerts: boolean
  emergencyLock: boolean
  lastPasswordChange: string | null
  sessions: ActiveSession[]
}

export interface ActiveSession {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: string
  current: boolean
}

export interface AccessibilitySettings {
  highContrast: boolean
  reduceMotion: boolean
  underlineLinks: boolean
  focusVisible: boolean
  simplifiedReading: boolean
  hideDecorations: boolean
  lowStimulation: boolean
}

export interface AudioVoiceSettings {
  interfaceSounds: boolean
  volume: number
  elianaVoice: string
  autoPlay: boolean
  speechRate: number
  subtitles: boolean
  transcription: boolean
  microphoneEnabled: boolean
}

export interface UserPreferences {
  userId: string
  themeMode: ThemeMode
  accentColor: AccentColorName
  customAccentColor: string
  compactMode: boolean
  fontScale: FontScale
  motionPreference: MotionPreference
  language: Language
  region: string
  timezone: string
  notifications: NotificationSettings
  privacy: PrivacySettings
  languageRegion: LanguageRegionSettings
  security: SecuritySettings
  accessibility: AccessibilitySettings
  audioVoice: AudioVoiceSettings
  updatedAt: string
}

export type SettingsSection =
  | 'perfil' | 'apariencia' | 'notificaciones' | 'privacidad'
  | 'idioma' | 'seguridad' | 'accesibilidad' | 'audio'

export type UIState = 'idle' | 'loading' | 'saving' | 'saved' | 'error' | 'offline' | 'sync_pending'

export const ACCENT_COLORS: Record<AccentColorName, string> = {
  zafiro: '#00D9FF',
  cian: '#06B6D4',
  violeta: '#8B5CF6',
  dorado: '#F59E0B',
  esmeralda: '#10B981',
  rubi: '#EF4444',
  rosa: '#EC4899',
  naranja: '#F97316',
  plata: '#94A3B8',
  custom: '#00D9FF',
}

export const ACCENT_COLOR_NAMES: Record<AccentColorName, string> = {
  zafiro: 'ZAFIRO',
  cian: 'CIAN',
  violeta: 'VIOLETA',
  dorado: 'DORADO',
  esmeralda: 'VERDE ESMERALDA',
  rubi: 'ROJO RUBÍ',
  rosa: 'ROSA',
  naranja: 'NARANJA',
  plata: 'PLATA',
  custom: 'PERSONALIZADO',
}

export const FONT_SCALE_VALUES: Record<FontScale, number> = {
  pequena: 0.875,
  normal: 1,
  grande: 1.125,
  'muy-grande': 1.25,
}

export const LANGUAGES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'sistema', 'comunidad', 'mensajes', 'marketplace',
  'editorial', 'economia', 'seguridad', 'eliana', 'promociones',
]

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  'in-app', 'email', 'whatsapp', 'push',
]
