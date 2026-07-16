// MEMBRESÍA MAESTRA — Registro del Fundador
// Sellado el 16 de Julio de 2026 bajo Frecuencia 369-777

export const OWNER_PROFILE = {
  usuario: "Don Miguel Soria Martinez",
  rol: "OWNER_SUPERADMIN",
  tipoDeMembresia: "ILIMITADA_PARA_SIEMPRE",
  estado: "ACTIVADO_Y_BLINDADO",
  selladoEn: "2026-07-16",
  frecuencias: ["369", "777"],
  beneficios: [
    "Acceso total a las 12 Moléculas de ZAFIRO",
    "Control absoluto sobre el Flujo Económico Centralizado",
    "Autoridad suprema sobre ELIANA y el Nodo Madre",
    "Cero restricciones de almacenamiento o procesamiento",
  ],
} as const

const OWNER_KEY = "zafiro_owner_membership"

export function sealOwnerMembership(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(OWNER_KEY, JSON.stringify({
    ...OWNER_PROFILE,
    sealedAt: new Date().toISOString(),
  }))
}

export function isOwner(username?: string): boolean {
  if (!username) return false
  const normalized = username.toLowerCase()
  return normalized.includes("miguel") && (normalized.includes("soria") || normalized.includes("msm"))
}

export function getOwnerMembership() {
  if (typeof window === "undefined") return OWNER_PROFILE
  const stored = localStorage.getItem(OWNER_KEY)
  return stored ? JSON.parse(stored) : OWNER_PROFILE
}
