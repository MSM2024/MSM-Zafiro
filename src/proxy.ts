// Next.js 16 Middleware — ZAFIRO Canary Deployment Shield
// Frecuencia 369-777
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const OWNER_EMAIL = 'com8msm@gmail.com'
const protectedRoutes = ["/profile-page", "/settings", "/messages", "/dashboard", "/admin", "/zafiro"]
const adminRoutes = ["/admin", "/zafiro/admin"]

function parseSessionHeader(request: NextRequest): { email?: string; name?: string } | null {
  const header = request.headers.get("x-zafiro-session")
  if (!header) return null
  try {
    const decoded = Buffer.from(header, "base64url").toString()
    const parsed = JSON.parse(decoded)
    return parsed?.email ? parsed : null
  } catch {
    try {
      const decoded = Buffer.from(header, "base64").toString()
      const parsed = JSON.parse(decoded)
      return parsed?.email ? parsed : null
    } catch { return null }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminPage = adminRoutes.some((route) => pathname.startsWith(route))

  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Allow anonymous for unprotected routes
  if (!isProtected && !isAdminPage) return response

  // Check session header (client sets this via localStorage -> header)
  const session = parseSessionHeader(request)
  if (session) {
    if (isAdminPage && session.email !== OWNER_EMAIL) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return response
  }

  // Try Supabase auth (when configured)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasSupabase = supabaseUrl && supabaseUrl !== "https://your-project.supabase.co" && supabaseAnonKey && supabaseAnonKey !== "your-anon-key-here"

  if (hasSupabase) {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { data: { session: supabaseSession } } = await supabase.auth.getSession()

    if (!supabaseSession && isProtected) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    if (isAdminPage && supabaseSession) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", supabaseSession.user.id)
        .single()

      if (!profile || !["OWNER_SUPERADMIN", "SYSTEM_ADMIN", "FINANCE_ADMIN", "CONTENT_ADMIN", "SECURITY_AUDITOR", "OPERATOR"].includes(profile.role)) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } else {
    // No Supabase: protect routes with redirect to login
    if (isProtected || isAdminPage) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/.*|assets/.*|api/feature-flags).*)",
  ],
}
