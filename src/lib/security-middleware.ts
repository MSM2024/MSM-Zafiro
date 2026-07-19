import { NextRequest, NextResponse } from 'next/server'
import { hasPermission, validateSession, writeAudit, checkRateLimit, recordSecurityEvent } from './angel-security'
import { getSession } from './auth'
import type { Permission, UserRole } from '@zafiro/types'

// ============================================================
// SECURITY MIDDLEWARE — Protección para API Routes
// ============================================================

interface AuthResult {
  authenticated: boolean
  profile?: { id: string; email: string; role: UserRole }
  error?: string
  status?: number
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

function getClientUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown'
}

export function authenticateRequest(request: NextRequest): AuthResult {
  const headerSession = request.headers.get('x-zafiro-session')
  if (headerSession) {
    try {
      const parsed = JSON.parse(Buffer.from(headerSession, 'base64').toString())
      const { valid, profile, role } = validateSession(parsed)
      if (valid && profile && role) {
        return { authenticated: true, profile: { id: profile.id, email: parsed.email || 'unknown', role } }
      }
    } catch {
      // Invalid header, fall through
    }
  }

  const s = getSession()
  const { valid, profile, role } = validateSession()
  if (!valid || !profile || !role) {
    return {
      authenticated: false,
      error: 'No autorizado — sesión inválida o expirada',
      status: 401,
    }
  }
  return {
    authenticated: true,
    profile: { id: profile.id, email: s?.email || 'unknown', role },
  }
}

export function authorize(permission: Permission) {
  return (request: NextRequest): AuthResult => {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) return auth
    if (!auth.profile) {
      return { authenticated: false, error: 'Perfil no encontrado', status: 401 }
    }
    if (!hasPermission(auth.profile.role, permission)) {
      return {
        authenticated: false,
        error: `Permiso denegado — se requiere: ${permission}`,
        status: 403,
      }
    }
    return auth
  }
}

export function withAudit(
  handler: (req: NextRequest, auth: AuthResult) => Promise<NextResponse>,
  action: string,
  resource: string,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
    }

    const response = await handler(request, auth)
    const ip = getClientIp(request)
    const ua = getClientUserAgent(request)

    if (auth.profile) {
      writeAudit(
        auth.profile.id,
        auth.profile.email,
        action,
        resource,
        request.nextUrl.pathname,
        { method: request.method, status: response.status, ip },
        { mfaVerified: false, success: response.status < 400, ipAddress: ip, userAgent: ua },
      )
    }

    return response
  }
}

export function withRateLimit(
  handler: (req: NextRequest, auth: AuthResult) => Promise<NextResponse>,
  maxAttempts = 10,
  windowMs = 60000,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIp(request)
    const key = `api:${ip}:${request.nextUrl.pathname}`
    const { allowed, remaining, resetAt } = checkRateLimit(key, maxAttempts, windowMs)

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
      recordSecurityEvent('RATE_LIMIT_HIT', 'system', ip, { path: request.nextUrl.pathname, retryAfter }, 'WARNING', ip)
      return NextResponse.json(
        { error: 'Demasiadas solicitudes — intente de nuevo más tarde', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }

    const auth = authenticateRequest(request)
    const response = await handler(request, auth)

    return response
  }
}

export function requireMethod(request: NextRequest, allowedMethods: string[]): NextResponse | null {
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: `Método ${request.method} no permitido` },
      { status: 405, headers: { Allow: allowedMethods.join(', ') } },
    )
  }
  return null
}

export function validateBody<T>(request: NextRequest, validator: (body: unknown) => T | Error): T | NextResponse {
  try {
    const body = request.body ? JSON.parse(request.body as unknown as string) : {}
    const result = validator(body)
    if (result instanceof Error) {
      throw result
    }
    return result
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cuerpo de solicitud inválido'
    return NextResponse.json({ error: message }, { status: 400 }) as unknown as T
  }
}
