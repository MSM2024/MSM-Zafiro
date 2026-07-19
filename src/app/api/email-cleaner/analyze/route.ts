import { NextRequest, NextResponse } from "next/server"
import { classifyEmail } from "@/lib/email-cleaner/classifier"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, accountEmail } = body as { accountId?: string; accountEmail?: string }

    if (!accountId || !accountEmail) {
      return NextResponse.json({ error: 'accountId y accountEmail requeridos' }, { status: 400 })
    }

    const allowed = ['cm8msm@gmail.com', 'msmmystore@gmail.com']
    if (!allowed.includes(accountEmail)) {
      return NextResponse.json({ error: 'Cuenta no autorizada' }, { status: 403 })
    }

    const mockMessages = [
      { id: 'msg1', subject: 'Gana dinero rápido desde casa', from: 'spam@tempmail.com', date: new Date(Date.now() - 2 * 86400000).toISOString(), sizeKB: 12, body: 'Haz clic aquí para ganar dinero sin esfuerzo' },
      { id: 'msg2', subject: 'Factura pendiente de pago', from: 'factura@falso-banco.com', date: new Date(Date.now() - 5 * 86400000).toISOString(), sizeKB: 45, body: 'Su factura está pendiente. Acceda ahora para pagar.' },
      { id: 'msg3', subject: 'Notificación de seguridad: su cuenta será desactivada', from: 'security@phishing-google.com', date: new Date(Date.now() - 1 * 86400000).toISOString(), sizeKB: 8, body: 'Acción requerida: verifique su cuenta inmediatamente' },
      { id: 'msg4', subject: 'Invitación a webinar de emprendimiento', from: 'info@msmmystore.com', date: new Date(Date.now() - 10 * 86400000).toISOString(), sizeKB: 120, body: 'Te invitamos a nuestro próximo webinar' },
      { id: 'msg5', subject: 'Tu factura de Vercel - Junio 2026', from: 'billing@vercel.com', date: new Date(Date.now() - 3 * 86400000).toISOString(), sizeKB: 256, body: 'Adjuntamos tu factura mensual' },
      { id: 'msg6', subject: 'RE: Consulta sobre membresía', from: 'cliente@dominio.com', date: new Date(Date.now() - 15 * 86400000).toISOString(), sizeKB: 3400, body: 'Gracias por responder a mi consulta' },
      { id: 'msg7', subject: 'Oferta especial - 50% de descuento', from: 'promos@tienda-online.com', date: new Date(Date.now() - 20 * 86400000).toISOString(), sizeKB: 89, body: 'No te pierdas esta oferta exclusiva' },
      { id: 'msg8', subject: 'Video tutorial completo', from: 'notificaciones@youtube.com', date: new Date(Date.now() - 60 * 86400000).toISOString(), sizeKB: 15000, body: 'Nuevo video disponible' },
    ]

    const spamMessages = mockMessages.filter(m => {
      const result = classifyEmail(m.from, m.subject, m.body, m.sizeKB > 10000, '', false)
      return result.isSpam
    })

    const largeMessages = mockMessages.filter(m => m.sizeKB > 10240)
    const oldMessages = mockMessages.filter(m => {
      const age = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24)
      return age > 30
    })
    const promotionMessages = mockMessages.filter(m => {
      const { isSpam } = classifyEmail(m.from, m.subject, m.body, false, '', false)
      return !isSpam && (m.subject.toLowerCase().includes('oferta') || m.subject.toLowerCase().includes('descuento'))
    })

    const categories = [
      {
        name: 'spam',
        label: 'Spam',
        messageCount: spamMessages.length,
        estimatedSpaceMB: Math.round(spamMessages.reduce((a, m) => a + m.sizeKB, 0) / 1024),
        topSenders: [...new Set(spamMessages.map(m => m.from.split('@')[1]))],
        riskLevel: spamMessages.length > 0 ? 'high' as const : 'low' as const,
        suggestedAction: 'SPAM' as const,
        sampleMessages: spamMessages.map(m => ({ id: m.id, subject: m.subject, from: m.from, date: m.date, sizeKB: m.sizeKB })),
      },
      {
        name: 'promotions',
        label: 'Promociones',
        messageCount: promotionMessages.length,
        estimatedSpaceMB: Math.round(promotionMessages.reduce((a, m) => a + m.sizeKB, 0) / 1024),
        topSenders: [...new Set(promotionMessages.map(m => m.from.split('@')[1]))],
        riskLevel: 'low' as const,
        suggestedAction: 'LABEL' as const,
      },
      {
        name: 'large',
        label: 'Archivos grandes (>10 MB)',
        messageCount: largeMessages.length,
        estimatedSpaceMB: Math.round(largeMessages.reduce((a, m) => a + m.sizeKB, 0) / 1024),
        topSenders: [...new Set(largeMessages.map(m => m.from.split('@')[1]))],
        riskLevel: 'medium' as const,
        suggestedAction: 'ARCHIVE' as const,
        sampleMessages: largeMessages.map(m => ({ id: m.id, subject: m.subject, from: m.from, date: m.date, sizeKB: m.sizeKB })),
      },
      {
        name: 'old',
        label: 'Correos antiguos (>30 días)',
        messageCount: oldMessages.length,
        estimatedSpaceMB: Math.round(oldMessages.reduce((a, m) => a + m.sizeKB, 0) / 1024),
        topSenders: [...new Set(oldMessages.map(m => m.from.split('@')[1]))],
        riskLevel: 'low' as const,
        suggestedAction: 'ARCHIVE' as const,
      },
    ]

    const analysis = {
      accountId,
      accountEmail,
      categories,
      totalMessages: mockMessages.length,
      estimatedSpaceMB: categories.reduce((a, c) => a + c.estimatedSpaceMB, 0),
      analyzedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, analysis })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
