// Next.js 16 Middleware — ZAFIRO Canary Deployment Shield
// Frecuencia 369-777
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const protectedRoutes = ["/profile-page", "/settings", "/messages", "/dashboard", "/admin", "/zafiro"]
const adminRoutes = ["/admin", "/zafiro/admin"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminPage = adminRoutes.some((route) => pathname.startsWith(route))

  // Security headers
  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Allow anonymous for unprotected routes
  if (!isProtected && !isAdminPage) return response

  // Check for session header (client-side auth fallback)
  const headerSession = request.headers.get("x-zafiro-session")
  if (headerSession) {
    try {
      const parsed = JSON.parse(Buffer.from(headerSession, "base64").toString())
      if (parsed.email) {
        return response
      }
    } catch { /* ignore invalid header */ }
  }

  // Try Supabase auth
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

    const { data: { session } } = await supabase.auth.getSession()

    if (!session && isProtected) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    if (isAdminPage && session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (!profile || !["OWNER_SUPERADMIN", "SYSTEM_ADMIN", "FINANCE_ADMIN", "CONTENT_ADMIN", "SECURITY_AUDITOR", "OPERATOR"].includes(profile.role)) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/.*|assets/.*|api/feature-flags).*)",
  ],
}
