import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ success: true, entries: [], total: 0 })
}
