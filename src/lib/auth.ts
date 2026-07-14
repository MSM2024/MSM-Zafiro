'use client'

import { applyReferralCode } from "./referidos"
import { createProfile, seedMiguelProfile } from "./profile"
import { getSupabaseClient, isSupabaseAvailable } from "./supabase"

export type UserRole = "OWNER" | "CASHIER" | "VIEWER"

export interface ZafiroUser {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  avatar?: string
}

export interface ZafiroSession {
  email: string
  name: string
  id: string
  role?: UserRole
}

const USERS_KEY = "zafiro_users"
const SESSION_KEY = "zafiro_session"
const ROLE_KEY = "zafiro_user_role"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "zafiro_salt_v1")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
}

export function getUsers(): ZafiroUser[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") } catch { return [] }
}

export function findUserByEmail(email: string): ZafiroUser | undefined {
  return getUsers().find(u => u.email === email)
}

function saveUsers(users: ZafiroUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// --- Supabase-aware registration ---
export async function registerUser(name: string, email: string, password: string, referralCode?: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return { ok: false, error: error.message }
    if (!data.user) return { ok: false, error: "No se pudo crear el usuario" }

    const sbId = data.user.id
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name, id: sbId, role: "VIEWER" }))
    if (referralCode) applyReferralCode(referralCode, sbId, email)
    createProfile(sbId, email, name)
    return { ok: true }
  }

  // Fallback: localStorage
  const users = getUsers()
  if (users.find(u => u.email === email)) return { ok: false, error: "Este correo ya está registrado" }
  const passwordHash = await hashPassword(password)
  const user: ZafiroUser = { id: `user_${Date.now()}`, name, email, passwordHash, createdAt: new Date().toISOString() }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name, id: user.id }))
  if (referralCode) applyReferralCode(referralCode, user.id, email)
  createProfile(user.id, email, name)
  return { ok: true }
}

export function seedDemoProfile() {
  return seedMiguelProfile()
}

// --- Supabase-aware login ---
export async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string; session?: ZafiroSession }> {
  const supabase = getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    if (!data.user) return { ok: false, error: "No se pudo autenticar" }

    const name = data.user.user_metadata?.name || email.split("@")[0]
    const session: ZafiroSession = { email, name, id: data.user.id }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { ok: true, session }
  }

  // Fallback: localStorage
  const users = getUsers()
  const user = users.find(u => u.email === email)
  if (!user) return { ok: false, error: "Correo no registrado" }
  const hash = await hashPassword(password)
  if (user.passwordHash !== hash) return { ok: false, error: "Contraseña incorrecta" }
  const session: ZafiroSession = { email: user.email, name: user.name, id: user.id }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, session }
}

// --- Supabase-aware session ---
export function getSession(): ZafiroSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
    return null
  } catch { return null }
}

// --- Refresh session from Supabase (call on app mount) ---
export async function refreshSession(): Promise<ZafiroSession | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return getSession()

  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.user) {
    logout()
    return null
  }

  const user = data.session.user
  const session: ZafiroSession = {
    email: user.email || "",
    name: user.user_metadata?.name || user.email?.split("@")[0] || "",
    id: user.id,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

// --- Logout (Supabase + localStorage) ---
export async function logout(): Promise<void> {
  const supabase = getSupabaseClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ROLE_KEY)
}

// --- Password recovery ---
export async function recoverPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${appUrl}/auth/verify` })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  // Fallback: localStorage
  const user = findUserByEmail(email)
  if (!user) return { ok: false, error: "No existe una cuenta con ese correo" }
  return { ok: true, error: "Modo demo: revisa tu consola" }
}

// --- Role helpers ---
export function getUserRole(): UserRole {
  if (typeof window === "undefined") return "VIEWER"
  return (localStorage.getItem(ROLE_KEY) as UserRole) || "VIEWER"
}

export function setUserRole(role: UserRole) {
  localStorage.setItem(ROLE_KEY, role)
}

export function requireRole(required: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = { OWNER: 3, CASHIER: 2, VIEWER: 1 }
  return hierarchy[getUserRole()] >= hierarchy[required]
}

export function isLoggedIn(): boolean {
  return getSession() !== null
}
