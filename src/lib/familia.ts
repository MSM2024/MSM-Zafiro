// NUBE FAMILIAR — Encuentro Soria Martínez 2026
// Linaje confirmado por Don Miguel — NO inventar datos

export interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  branch: "paterna" | "materna"
  generation: "bisabuelos" | "abuelos" | "hijos" | "nietos"
  verificationStatus: "confirmed" | "pending" | "unverified"
  isAlive?: boolean
  nickname?: string
}

export interface ReunionGuest {
  id: string
  fullName: string
  branch: string
  phone?: string
  country?: string
  companions: number
  status: "confirmed" | "pending" | "not_attending"
  transport?: string
  message?: string
  createdAt: string
}

export const REUNION = {
  title: "Gran Encuentro Familiar Soria Martínez",
  date: "2026-08-16T09:00:00",
  location: "Finca Las Siete Vueltas, Mayarí Arriba, Segundo Frente, Santiago de Cuba",
  lema: "Honramos nuestras raíces, celebramos nuestra familia y construimos el legado de las próximas generaciones",
  frequency: "3-6-9",
  privacy: "Evento familiar privado",
}

// ÁRBOL CONFIRMADO — Rama Paterna: Soria Macías
export const RAMA_PATERNA: FamilyMember[] = [
  { id: "sp-1", firstName: "Joaquín", lastName: "Soria Macías", branch: "paterna", generation: "abuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sp-2", firstName: "Celia", lastName: "Macías Chacón", branch: "paterna", generation: "abuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sp-3", firstName: "Aquilino Pascual", lastName: "Soria Macías", branch: "paterna", generation: "hijos", verificationStatus: "confirmed", nickname: "Nano" },
  { id: "sp-4", firstName: "Daniel", lastName: "Soria Macías", branch: "paterna", generation: "hijos", verificationStatus: "confirmed", nickname: "Chino" },
  { id: "sp-5", firstName: "Marciano", lastName: "Soria Macías", branch: "paterna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sp-6", firstName: "Ana Amparo", lastName: "Soria Macías", branch: "paterna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sp-7", firstName: "Osvaldo", lastName: "Soria Macías", branch: "paterna", generation: "hijos", verificationStatus: "confirmed" },
]

// ÁRBOL CONFIRMADO — Rama Materna: Martínez Sablón
export const RAMA_MATERNA: FamilyMember[] = [
  // Bisabuelos
  { id: "sm-1", firstName: "Jutilino", lastName: "Martínez", branch: "materna", generation: "bisabuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sm-2", firstName: "Emilia", lastName: "Torres", branch: "materna", generation: "bisabuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sm-3", firstName: "Severino", lastName: "Sablón", branch: "materna", generation: "bisabuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sm-4", firstName: "Susa", lastName: "Moraga", branch: "materna", generation: "bisabuelos", verificationStatus: "confirmed", isAlive: false },
  // Abuelos
  { id: "sm-5", firstName: "Luis", lastName: "Martínez Torres", branch: "materna", generation: "abuelos", verificationStatus: "confirmed", isAlive: false },
  { id: "sm-6", firstName: "Cruz María", lastName: "Sablón Moraga", branch: "materna", generation: "abuelos", verificationStatus: "confirmed", isAlive: false },
  // Hijos conocidos
  { id: "sm-7", firstName: "Elia", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sm-8", firstName: "Reinerio", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sm-9", firstName: "Nildo", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sm-10", firstName: "Luis", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sm-11", firstName: "Ofelia", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
  { id: "sm-12", firstName: "Marbelina", lastName: "Martínez Sablón", branch: "materna", generation: "hijos", verificationStatus: "confirmed" },
]

export const PROGRAMA_DEL_DIA = [
  { hora: "09:00", actividad: "Llegada y bienvenida familiar" },
  { hora: "10:00", actividad: "Oración de gratitud y bendición" },
  { hora: "10:30", actividad: "Presentación del árbol genealógico" },
  { hora: "12:30", actividad: "Almuerzo familiar con comida sana" },
  { hora: "14:00", actividad: "Historias y recuerdos de los mayores" },
  { hora: "16:00", actividad: "Fotografía oficial de todas las generaciones" },
  { hora: "17:00", actividad: "Presentación de Villa Esperanza y MSM LegacyBook" },
  { hora: "18:00", actividad: "Celebración, música y cierre" },
]

// ── localStorage keys ──
const GUESTS_KEY = "zafiro_reunion_guests"
const PHOTOS_KEY = "zafiro_family_photos"
const STORIES_KEY = "zafiro_family_stories"

export function getGuests(): ReunionGuest[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(GUESTS_KEY) || "[]")
}

export function addGuest(guest: Omit<ReunionGuest, "id" | "createdAt">): ReunionGuest {
  const guests = getGuests()
  const newGuest: ReunionGuest = {
    ...guest,
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  guests.push(newGuest)
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
  return newGuest
}

export function getConfirmedCount(): number {
  return getGuests().filter(g => g.status === "confirmed").reduce((sum, g) => sum + 1 + g.companions, 0)
}

export function getDaysUntilReunion(): number {
  const now = new Date()
  const reunion = new Date(REUNION.date)
  const diff = reunion.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function getPhotosCount(): number {
  if (typeof window === "undefined") return 0
  return JSON.parse(localStorage.getItem(PHOTOS_KEY) || "[]").length
}

export function getStoriesCount(): number {
  if (typeof window === "undefined") return 0
  return JSON.parse(localStorage.getItem(STORIES_KEY) || "[]").length
}

export function getWhatsAppShareLink(): string {
  const text = encodeURIComponent(
    `🌳✨ *GRAN ENCUENTRO FAMILIAR SORIA MARTÍNEZ* ✨🌳\n\n` +
    `📅 *16 de Agosto de 2026*\n` +
    `📍 *Finca Las Siete Vueltas, Mayarí Arriba*\n\n` +
    `"${REUNION.lema}"\n\n` +
    `Confirma tu asistencia aquí:\n` +
    `https://zafiro.msmmystore.com/familia/encuentro-2026\n\n` +
    `🔱 Frecuencia 369 — Fe, Orden, Acción 💎🙏`
  )
  return `https://wa.me/?text=${text}`
}
