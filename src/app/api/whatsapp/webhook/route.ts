import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "node:crypto"
import { processElianaMessage } from "../../../../../packages/eliana/src/process-message"

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "zafiro_verify_2026"

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode")
  const token = req.nextUrl.searchParams.get("hub.verify_token")
  const challenge = req.nextUrl.searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse("Verification failed", { status: 403 })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("x-hub-signature-256") || ""

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)
    const entry = payload.entry?.[0]
    const change = entry?.changes?.[0]
    const message = change?.value?.messages?.[0]
    const from = change?.value?.metadata?.phone_number_id

    if (message && from) {
      await handleIncoming(from, message)
    }

    return NextResponse.json({ status: "ok" })
  } catch {
    return NextResponse.json({ error: "Parse error" }, { status: 400 })
  }
}

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret || !signature) return true
  const expected = "sha256=" + createHmac("sha256", secret).update(body).digest("hex")
  return signature === expected
}

async function handleIncoming(from: string, msg: any) {
  return processElianaMessage({
    messageId: msg.id || msg.wamid?.id || crypto.randomUUID(),
    channel: "WHATSAPP",
    contactId: from,
    text: msg.text?.body || "",
    timestamp: msg.timestamp || new Date().toISOString(),
  })
}
