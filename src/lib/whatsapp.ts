const WHATSAPP_API_KEY = process.env.WHATSAPP_BUSINESS_API_KEY
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_BUSINESS_PHONE_ID
const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0"

export async function sendWhatsAppOTP(phone: string, code: string): Promise<boolean> {
  if (!WHATSAPP_API_KEY || !WHATSAPP_PHONE_ID) {
    console.log("[WhatsApp Mock] OTP to", phone, ":", code)
    return true
  }

  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "zafiro_otp",
          language: { code: "es" },
          components: [{
            type: "body",
            parameters: [{ type: "text", text: code }],
          }],
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendRecoveryLink(phone: string, link: string): Promise<boolean> {
  if (!WHATSAPP_API_KEY || !WHATSAPP_PHONE_ID) {
    console.log("[WhatsApp Mock] Recovery link to", phone, ":", link)
    return true
  }

  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "zafiro_recovery",
          language: { code: "es" },
          components: [{
            type: "body",
            parameters: [{ type: "text", text: link }],
          }],
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
