/**
 * GUARDIÁN 1 — IDENTIDAD
 * require-aal2.ts — Exige nivel de autenticación AAL2 (MFA) para acciones sensibles.
 *
 * Uso:
 *   import { requireAAL2 } from "@/security/require-aal2"
 *   await requireAAL2(supabase, "pagos.cancelar")
 *
 * Rechaza si el usuario no tiene MFA activo o no verificó su sesión en AAL2.
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export class AAL2Error extends Error {
  constructor(
    message: string,
    public code: "MFA_REQUIRED" | "SESSION_EXPIRED" | "NOT_AUTHENTICATED"
  ) {
    super(message)
    this.name = "AAL2Error"
  }
}

export type SensitiveAction =
  | "pagos.cancelar"
  | "pagos.reembolsar"
  | "caja.retirar"
  | "caja.transferir"
  | "usuarios.eliminar"
  | "usuarios.cambiar-rol"
  | "configuracion.modificar"
  | "exportacion.realizar"
  | "wallet.transferir"
  | "suscripcion.cancelar"
  | "admin.migracion"
  | "admin.variables"

const ACTIONS_REQUIRING_AAL2: Set<SensitiveAction> = new Set([
  "pagos.cancelar",
  "pagos.reembolsar",
  "caja.retirar",
  "caja.transferir",
  "usuarios.eliminar",
  "usuarios.cambiar-rol",
  "configuracion.modificar",
  "exportacion.realizar",
  "wallet.transferir",
  "suscripcion.cancelar",
  "admin.migracion",
  "admin.variables",
])

export function requiresAAL2(action: string): action is SensitiveAction {
  return ACTIONS_REQUIRING_AAL2.has(action as SensitiveAction)
}

export async function requireAAL2(
  supabase: SupabaseClient,
  _action?: SensitiveAction
): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new AAL2Error(
      "Debes iniciar sesión para realizar esta acción.",
      "NOT_AUTHENTICATED"
    )
  }

  const factorsResult = await supabase.auth.mfa.listFactors()

  if (factorsResult.error) {
    throw new AAL2Error(
      "Error al verificar factores de autenticación.",
      "MFA_REQUIRED"
    )
  }

  const allFactors = factorsResult.data?.all || []
  const verifiedMFA = allFactors.filter(
    (f) => f.factor_type === "totp" && f.status === "verified"
  )

  if (verifiedMFA.length === 0) {
    throw new AAL2Error(
      `Esta acción requiere autenticación multifactor (MFA). ` +
        `Configúralo en tu perfil antes de continuar.`,
      "MFA_REQUIRED"
    )
  }

  const aalResult = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  const currentLevel = aalResult.data?.currentLevel

  if (currentLevel !== "aal2") {
    throw new AAL2Error(
      "Tu sesión actual no tiene nivel AAL2. Vuelve a iniciar sesión con MFA.",
      "SESSION_EXPIRED"
    )
  }
}
