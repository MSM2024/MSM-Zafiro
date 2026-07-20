export interface Devocional {
  id: string
  title: string
  content: string
  verse: string
  verseRef: string
  author: string
  date: string
  tags: string[]
  readingTimeMinutes: number
  featured: boolean
  createdAt: string
}

export interface Writer {
  id: string
  name: string
  bio: string
  avatar: string
  email: string
  specialties: string[]
  booksPublished: number
  joinedAt: string
  socialLinks: { platform: string; url: string }[]
  verified: boolean
}

export interface EditorialStats {
  totalBooks: number
  totalDevocionales: number
  totalWriters: number
  totalReaders: number
  publishedThisMonth: number
}

export type DevocionalCategory =
  | "fe"
  | "esperanza"
  | "proposito"
  | "sabiduria"
  | "gratitud"
  | "transformacion"
  | "fe-en-accion"
  | "silencio"
  | "perseverancia"

export const CATEGORY_LABELS: Record<DevocionalCategory, string> = {
  fe: "Fe",
  esperanza: "Esperanza",
  proposito: "Propósito",
  sabiduria: "Sabiduría",
  gratitud: "Gratitud",
  transformacion: "Transformación",
  "fe-en-accion": "Fe en Acción",
  silencio: "Silencio",
  perseverancia: "Perseverancia",
}
