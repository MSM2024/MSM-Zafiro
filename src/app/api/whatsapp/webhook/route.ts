import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { processWhatsAppMessage } from '@/lib/eliana/whatsapp/whatsapp-handler'
import type { WhatsAppInbound } from '@/lib/eliana/whatsapp/whatsapp-handler'
import { getNodeByPhoneId } from '@/lib/whatsapp-client'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'zafiro_verify_2026'
const WHATSAPP_API_VERSION = 'v22.0'
const WHATSAPP_BASE = 'https://graph.facebook.com'

async function sendWhatsAppMessage(phoneNumberId: string, to: string, text: string): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!token) {
    console.error('WHATSAPP_ACCESS_TOKEN no configurado — no se puede responder')
    return false
  }
  try {
    const url = `${WHATSAPP_BASE}/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('WhatsApp API error:', err)
      return false
    }
    return true
  } catch (err) {
    console.error('WhatsApp send failed:', err)
    return false
  }
}

async function writeAudit(event: { nodeId: string; action: string; contactId: string; result: string; reason?: string }): Promise<void> {
  const fs = await import('node:fs/promises')
  const logPath = process.env.AUDIT_LOG_PATH || './audit.log'
  const entry = JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + '\n'
  try { await fs.appendFile(logPath, entry) } catch {}
}

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Verification failed', { status: 403 })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') || ''

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)
    const entry = payload.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const messages = value?.messages
    const phoneNumberId = value?.metadata?.phone_number_id

    if (!messages || !phoneNumberId) {
      return NextResponse.json({ status: 'ok' })
    }

    const node = getNodeByPhoneId(phoneNumberId)
    const nodeId = node ? phoneNumberId : 'unknown'

    for (const msg of messages) {
      const senderId = msg.from || phoneNumberId
      const recipientId = value?.metadata?.display_phone_number || phoneNumberId

      if (senderId === recipientId) {
        await writeAudit({ nodeId, action: 'self_message_blocked', contactId: senderId, result: 'blocked' })
        continue
      }

      const inbound: WhatsAppInbound = {
        messageId: msg.id || createHmac('sha256', msg.from || '').update(body).digest('hex').slice(0, 16),
        contactId: senderId,
        text: msg.text?.body || '',
        timestamp: msg.timestamp || new Date().toISOString(),
      }

      await writeAudit({ nodeId, action: 'message.received', contactId: inbound.contactId, result: 'processing' })

      const result = await processWhatsAppMessage(inbound)

      if (result.text) {
        const sent = await sendWhatsAppMessage(phoneNumberId, senderId, result.text)
        await writeAudit({
          nodeId,
          action: 'message.sent',
          contactId: inbound.contactId,
          result: sent ? 'success' : 'failed',
          reason: result.filtered ? 'filtered' : undefined,
        })
      }

      await writeAudit({ nodeId, action: 'message.processed', contactId: inbound.contactId, result: 'success' })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Parse error' }, { status: 400 })
  }
}

function verifySignature(body: string, signature: string): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) {
    console.error('WHATSAPP_APP_SECRET no configurado')
    return false
  }
  if (!signature) return false
  const expected = 'sha256=' + createHmac('sha256', appSecret).update(body).digest('hex')
  return signature === expected
}
