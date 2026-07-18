import type {
  UserPreferences, NotificationSettings, PrivacySettings,
  LanguageRegionSettings, SecuritySettings, AccessibilitySettings, AudioVoiceSettings,
  NotificationCategory, NotificationChannel,
} from './types'

export function defaultNotificationSettings(): NotificationSettings {
  const categories = {} as Record<NotificationCategory, boolean>
  const allCats: NotificationCategory[] = [
    'sistema', 'comunidad', 'mensajes', 'marketplace',
    'editorial', 'economia', 'seguridad', 'eliana', 'promociones',
  ]
  for (const c of allCats) categories[c] = c !== 'promociones'

  const channels = {} as Record<NotificationChannel, boolean>
  const allChannels: NotificationChannel[] = ['in-app', 'email', 'whatsapp', 'push']
  for (const ch of allChannels) channels[ch] = ch === 'in-app'

  return {
    categories,
    channels,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    frequency: 'inmediata',
  }
}

export function defaultPrivacySettings(): PrivacySettings {
  return {
    profilePublic: true,
    whoCanFollow: 'todos',
    whoCanMessage: 'todos',
    showActivity: true,
    showBusiness: true,
    showPosts: true,
    allowElianaPersonalization: true,
    allowAnalytics: true,
    allowCommunications: true,
  }
}

export function defaultLanguageRegionSettings(): LanguageRegionSettings {
  return {
    language: 'es',
    country: 'CU',
    timezone: 'America/Havana',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'USD',
    decimalSeparator: '.',
    readingDirection: 'ltr',
  }
}

export function defaultSecuritySettings(): SecuritySettings {
  return {
    mfaEnabled: false,
    mfaVerified: false,
    recoveryCodesGenerated: false,
    loginAlerts: true,
    emergencyLock: false,
    lastPasswordChange: null,
    sessions: [],
  }
}

export function defaultAccessibilitySettings(): AccessibilitySettings {
  return {
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false,
    focusVisible: true,
    simplifiedReading: false,
    hideDecorations: false,
    lowStimulation: false,
  }
}

export function defaultAudioVoiceSettings(): AudioVoiceSettings {
  return {
    interfaceSounds: true,
    volume: 70,
    elianaVoice: 'default',
    autoPlay: false,
    speechRate: 1,
    subtitles: true,
    transcription: false,
    microphoneEnabled: false,
  }
}

export function defaultPreferences(userId: string): UserPreferences {
  const tz = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'America/Havana'

  return {
    userId,
    themeMode: 'system',
    accentColor: 'zafiro',
    customAccentColor: '#00D9FF',
    compactMode: false,
    fontScale: 'normal',
    motionPreference: 'sistema',
    language: 'es',
    region: 'CU',
    timezone: tz,
    notifications: defaultNotificationSettings(),
    privacy: defaultPrivacySettings(),
    languageRegion: defaultLanguageRegionSettings(),
    security: defaultSecuritySettings(),
    accessibility: defaultAccessibilitySettings(),
    audioVoice: defaultAudioVoiceSettings(),
    updatedAt: new Date().toISOString(),
  }
}
