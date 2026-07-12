'use client'

import { applyReferralCode } from "./referidos"
import { createProfile, seedMiguelProfile } from "./profile"

export interface ZafiroUser {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  avatar?: string
}

const USERS_KEY = "zafiro_users"
const SESSION_KEY = "zafiro_session"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "zafiro_salt_v1")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
}

export function getUsers(): ZafiroUser[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

export function findUserByEmail(email: string): ZafiroUser | undefined {
  return getUsers().find(u => u.email === email)
}

function saveUsers(users: ZafiroUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export async function registerUser(name: string, email: string, password: string, referralCode?: string): Promise<{ ok: boolean; error?: string }> {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    return { ok: false, error: "Este correo ya está registrado" }
  }
  const passwordHash = await hashPassword(password)
  const user: ZafiroUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name, id: user.id }))
  if (referralCode) {
    applyReferralCode(referralCode, user.id, email)
  }
  createProfile(user.id, email, name)
  return { ok: true }
}

export function seedDemoProfile() {
  return seedMiguelProfile()
}

export async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const users = getUsers()
  const user = users.find(u => u.email === email)
  if (!user) return { ok: false, error: "Correo no registrado" }
  const hash = await hashPassword(password)
  if (user.passwordHash !== hash) return { ok: false, error: "Contraseña incorrecta" }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name, id: user.id }))
  return { ok: true }
}

export function getSession(): { email: string; name: string; id: string } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function isLoggedIn(): boolean {
  return getSession() !== null
}
