import type { Devocional, Writer, EditorialStats } from "./types"
import { addNotification } from "@/lib/notifications"

const LS_DEVOCIONALES = "zafiro_devocionales"
const LS_WRITERS = "zafiro_editorial_writers"
const LS_STATS = "zafiro_editorial_stats"

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function lsSet<T>(key: string, val: T): void {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* quota */ }
}

function genId(): string {
  return `ed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}
function now(): string {
  return new Date().toISOString()
}

export function getDevocionales(): Devocional[] {
  return lsGet<Devocional[]>(LS_DEVOCIONALES, [])
}
export function getDevocional(id: string): Devocional | undefined {
  return getDevocionales().find(d => d.id === id)
}
export function addDevocional(data: Omit<Devocional, "id" | "createdAt">): Devocional {
  const list = getDevocionales()
  const entry: Devocional = { ...data, id: genId(), createdAt: now() }
  list.push(entry)
  lsSet(LS_DEVOCIONALES, list)
  try {
    addNotification({
      title: "Nuevo devocional publicado",
      message: `"${entry.title}" por ${entry.author} — ${entry.verseRef.slice(0, 30)}`,
      type: "info",
      pillar: "editorial",
      read: false,
      actionUrl: `/editorial/devocionales/${entry.id}`,
    })
  } catch {}
  return entry
}
export function updateDevocional(id: string, data: Partial<Devocional>): Devocional | undefined {
  const list = getDevocionales()
  const idx = list.findIndex(d => d.id === id)
  if (idx === -1) return undefined
  list[idx] = { ...list[idx], ...data }
  lsSet(LS_DEVOCIONALES, list)
  return list[idx]
}
export function deleteDevocional(id: string): void {
  lsSet(LS_DEVOCIONALES, getDevocionales().filter(d => d.id !== id))
}
export function getFeaturedDevocional(): Devocional | undefined {
  return getDevocionales().find(d => d.featured) || getDevocionales()[0]
}
export function getTodayDevocional(): Devocional | undefined {
  const today = new Date().toISOString().slice(0, 10)
  return getDevocionales().find(d => d.date === today)
}

export function getWriters(): Writer[] {
  return lsGet<Writer[]>(LS_WRITERS, [])
}
export function addWriter(data: Omit<Writer, "id" | "joinedAt">): Writer {
  const list = getWriters()
  const entry: Writer = { ...data, id: genId(), joinedAt: now() }
  list.push(entry)
  lsSet(LS_WRITERS, list)
  try {
    addNotification({
      title: "Nuevo escritor registrado",
      message: `${entry.name} se unió a MSM Editorial — ${entry.specialties.join(", ")}`,
      type: "info",
      pillar: "editorial",
      read: false,
      actionUrl: `/editorial/escritores/${entry.id}`,
    })
  } catch {}
  return entry
}
export function updateWriter(id: string, data: Partial<Writer>): Writer | undefined {
  const list = getWriters()
  const idx = list.findIndex(w => w.id === id)
  if (idx === -1) return undefined
  list[idx] = { ...list[idx], ...data }
  lsSet(LS_WRITERS, list)
  return list[idx]
}
export function deleteWriter(id: string): void {
  lsSet(LS_WRITERS, getWriters().filter(w => w.id !== id))
}

export function getEditorialStats(): EditorialStats {
  const devs = getDevocionales()
  const writers = getWriters()
  const nowDate = new Date()
  const firstOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1).toISOString()
  return {
    totalBooks: lsGet<number>("zafiro_biblioteca_libros_count", 0),
    totalDevocionales: devs.length,
    totalWriters: writers.length,
    totalReaders: lsGet<number>("zafiro_editorial_readers", 0),
    publishedThisMonth: devs.filter(d => d.createdAt >= firstOfMonth).length,
  }
}
export function incrementReaders(): void {
  const count = lsGet<number>("zafiro_editorial_readers", 0)
  lsSet("zafiro_editorial_readers", count + 1)
}
