import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ventas, cancelaciones, total } = body

    if (typeof total !== "number") {
      return NextResponse.json({ error: "Total requerido" }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      cierre: {
        fecha: new Date().toISOString(),
        ventas: ventas || 0,
        cancelaciones: cancelaciones || 0,
        total,
        neto: total - (cancelaciones || 0),
      },
    })
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
