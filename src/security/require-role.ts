/**
 * GUARDIÁN 1 — IDENTIDAD
 * require-role.ts — Verifica roles de usuario antes de acciones protegidas.
 *
 * Uso:
 *   import { requireRole, type Role } from "@/security/require-role"
 *   await requireRole(supabase, ["owner", "admin"])
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export type Role = "owner" | "admin" | "cashier" | "viewer" | "user" | "sponsor"

export class RoleError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_AUTHENTICATED",
    public requiredRoles: Role[],
    public userRole?: Role
  ) {
    super(message)
    this.name = "RoleError"
  }
}

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 100,
  admin: 80,
  cashier: 60,
  sponsor: 50,
  user: 40,
  viewer: 20,
}

export const ACTION_ROLE_MAP: Record<string, Role[]> = {
  "pagos.cancelar": ["owner", "admin"],
  "pagos.reembolsar": ["owner", "admin"],
  "caja.retirar": ["owner", "admin"],
  "caja.transferir": ["owner", "admin"],
  "caja.ver": ["owner", "admin", "cashier"],
  "usuarios.eliminar": ["owner"],
  "usuarios.cambiar-rol": ["owner"],
  "usuarios.listar": ["owner", "admin"],
  "configuracion.modificar": ["owner", "admin"],
  "configuracion.ver": ["owner", "admin", "cashier"],
  "exportacion.realizar": ["owner", "admin"],
  "wallet.transferir": ["owner"],
  "suscripcion.cancelar": ["owner", "admin"],
  "admin.migracion": ["owner"],
  "admin.variables": ["owner"],
  "contenido.moderar": ["owner", "admin"],
  "reportes.ver": ["owner", "admin"],
  "reportes.gestionar": ["owner"],
}

export function getRequiredRoles(action: string): Role[] {
  return ACTION_ROLE_MAP[action] || ["owner", "admin"]
}

export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  const userLevel = ROLE_HIERARCHY[userRole]
  if (userLevel === undefined) return false
  return requiredRoles.some((r) => userLevel >= ROLE_HIERARCHY[r])
}

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<Role | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single()

  if (error || !data) return null
  return data.role as Role
}

export async function requireRole(
  supabase: SupabaseClient,
  requiredRoles: Role[]
): Promise<{ userId: string; role: Role }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new RoleError(
      "Debes iniciar sesión.",
      "NOT_AUTHENTICATED",
      requiredRoles
    )
  }

  const userRole = await getUserRole(supabase, user.id)

  if (!userRole || !hasRole(userRole, requiredRoles)) {
    throw new RoleError(
      `Acceso denegado. Se requiere uno de estos roles: ${requiredRoles.join(", ")}. Tu rol: ${userRole || "ninguno"}.`,
      "FORBIDDEN",
      requiredRoles,
      userRole || undefined
    )
  }

  return { userId: user.id, role: userRole }
}
