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

interface WhatsAppNode {
  phoneNumberId: string
  token: string
}

function getNodes(): WhatsAppNode[] {
  const nodes: WhatsAppNode[] = []
  const primaryId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const primaryToken = process.env.WHATSAPP_ACCESS_TOKEN
  if (primaryId && primaryToken) nodes.push({ phoneNumberId: primaryId, token: primaryToken })
  for (let i = 1; i <= 9; i++) {
    const id = process.env[`WHATSAPP_PHONE_NUMBER_ID_${i}`]
    const token = process.env[`WHATSAPP_ACCESS_TOKEN_${i}`]
    if (id && token) nodes.push({ phoneNumberId: id, token })
  }
  return nodes
}

export function getNodeByPhoneId(phoneNumberId: string): WhatsAppNode | undefined {
  return getNodes().find(n => n.phoneNumberId === phoneNumberId)
}

export function getAllNodes(): WhatsAppNode[] {
  return getNodes()
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

export async function sendWhatsAppViaNode(msg: WhatsAppMessage, node: WhatsAppNode): Promise<Response> {
  return fetch(`${BASE}/${node.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${node.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      ...msg,
    }),
  })
}

export async function broadcastToAllNodes(msg: Omit<WhatsAppMessage, "to">, to: string): Promise<Response[]> {
  const nodes = getNodes()
  return Promise.all(nodes.map(n => sendWhatsAppViaNode({ ...msg, to }, n)))
}
