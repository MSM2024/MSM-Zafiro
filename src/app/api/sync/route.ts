import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
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
