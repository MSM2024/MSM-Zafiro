import type { ThemeMode, AccentColorName, FontScale, MotionPreference } from './types'
import { FONT_SCALE_VALUES, ACCENT_COLORS } from './types'

function getRoot(): HTMLElement | null {
  return typeof document !== 'undefined' ? document.documentElement : null
}

function getPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function applyTheme(mode: ThemeMode): void {
  const root = getRoot()
  if (!root) return
  const isDark = mode === 'dark' || (mode === 'system' && getPrefersDark())
  root.classList.toggle('dark', isDark)
  root.classList.toggle('light', !isDark)
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export function applyAccentColor(color: string): void {
  const root = getRoot()
  if (!root) return
  const isValid = /^#[0-9a-fA-F]{6}$/.test(color)
  if (!isValid) return
  root.style.setProperty('--zafiro-accent', color)
  const hover = darken(color, 0.15)
  root.style.setProperty('--zafiro-accent-hover', hover)
  root.style.setProperty('--zafiro-accent-foreground', getContrastText(color))
  root.style.setProperty('--zafiro-accent-soft', `${color}20`)
  root.style.setProperty('--zafiro-focus-ring', `${color}50`)
  root.style.setProperty('--zafiro-accent-rgb', hexToRgb(color))
}

export function applyAccentByName(name: AccentColorName, customColor?: string): void {
  const color = name === 'custom' && customColor ? customColor : ACCENT_COLORS[name]
  applyAccentColor(color)
}

export function applyCompactMode(compact: boolean): void {
  const root = getRoot()
  if (!root) return
  root.classList.toggle('compact', compact)
  root.setAttribute('data-compact', compact ? 'true' : 'false')
}

export function applyFontScale(scale: FontScale): void {
  const root = getRoot()
  if (!root) return
  const value = FONT_SCALE_VALUES[scale]
  root.style.setProperty('--zafiro-font-scale', value.toString())
  root.setAttribute('data-font-scale', scale)
}

export function applyMotionPreference(pref: MotionPreference): void {
  const root = getRoot()
  if (!root) return
  const reduced = pref === 'reducido' || (pref === 'sistema' && getPrefersReducedMotion())
  root.classList.toggle('reduce-motion', reduced)
  root.setAttribute('data-motion', reduced ? 'reduced' : 'full')
}

export function applyAllTheme(options: {
  themeMode: ThemeMode
  accentColor: AccentColorName
  customAccentColor: string
  compactMode: boolean
  fontScale: FontScale
  motionPreference: MotionPreference
}): void {
  applyTheme(options.themeMode)
  applyAccentByName(options.accentColor, options.customAccentColor)
  applyCompactMode(options.compactMode)
  applyFontScale(options.fontScale)
  applyMotionPreference(options.motionPreference)
}

export function removeTheme(): void {
  const root = getRoot()
  if (!root) return
  root.classList.remove('dark', 'light', 'compact', 'reduce-motion')
  root.removeAttribute('data-theme')
  root.removeAttribute('data-compact')
  root.removeAttribute('data-font-scale')
  root.removeAttribute('data-motion')
  root.style.removeProperty('--zafiro-accent')
  root.style.removeProperty('--zafiro-accent-hover')
  root.style.removeProperty('--zafiro-accent-foreground')
  root.style.removeProperty('--zafiro-accent-soft')
  root.style.removeProperty('--zafiro-focus-ring')
  root.style.removeProperty('--zafiro-accent-rgb')
  root.style.removeProperty('--zafiro-font-scale')
}

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * amount))
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * amount))
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function getContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0a0a1a' : '#ffffff'
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
