const API_VERSION = "v22.0"
const BASE = `https://graph.facebook.com/${API_VERSION}`

export type TemplateComponent = {
  type: "header" | "body" | "footer"
  parameters: { type: "text"; text: string }[]
}

export type WhatsAppMessage = {
  to: string
  type: "text" | "template" | "interactive"
  text?: { body: string; preview_url?: boolean }
  template?: {
    name: string
    language: { code: string }
    components?: TemplateComponent[]
  }
  interactive?: {
    type: "button" | "list"
    body: { text: string }
    action: Record<string, unknown>
  }
}

export async function sendWhatsApp(msg: WhatsAppMessage): Promise<Response> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) throw new Error("WhatsApp not configured")

  return fetch(`${BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      ...msg,
    }),
  })
}
