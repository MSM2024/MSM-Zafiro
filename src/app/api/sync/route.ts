import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/security-middleware"
import { isFeatureEnabled } from "@/lib/feature-flags"

export async function POST(req: NextRequest) {
  if (isFeatureEnabled('SECURITY_MIDDLEWARE_ENABLED')) {
    const auth = authenticateRequest(req)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
    }
  }

  try {
    const op = await req.json()
    if (!op.table || !op.type || !op.payload) {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }
    return NextResponse.json({ confirmed: true, id: op.id })
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
