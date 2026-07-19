// Remesas Handler — Protocolo específico para consultas de remesas
// Frecuencia 369
// Cuando el usuario escriba "Remesas", ELIANA debe:
// 1. Explicar servicios disponibles
// 2. Solicitar: moneda, cantidad, origen, destino, método y receptor
// 3. Consultar reglas vigentes si es posible
// 4. NUNCA responder con mensaje vacío de refinamiento

import { DOMAIN_ENTRIES } from './knowledge/domain-data'

const REMESAS_ENTRIES = DOMAIN_ENTRIES.filter(e => e.domain === 'remesas_cambios')

export function isRemesasQuery(query: string): boolean {
  const lower = query.toLowerCase().trim()
  const keywords = ['remesa', 'envio', 'enviar dinero', 'cambio', 'divisa', 'cup', 'mlc', 'tasa de cambio']
  return keywords.some(k => lower.includes(k))
}

export function getRemesasResponse(query: string): string | null {
  const lower = query.toLowerCase().trim()

  // Simple greeting/one-word remesas query → full protocol
  if (lower === 'remesas' || lower === 'remesa' || lower === 'quiero enviar dinero' || lower === 'enviar dinero') {
    return getRemesasFullProtocol()
  }

  // Specific questions
  if (lower.includes('servicio') || lower.includes('disponible') || lower.includes('ofrecen')) {
    return getRemesasServices()
  }

  if (lower.includes('tasa') || lower.includes('cambio') || lower.includes('cup') || lower.includes('mlc')) {
    return getRemesasRates()
  }

  if (lower.includes('requisito') || lower.includes('necesito') || lower.includes('documento') || lower.includes('necesaria')) {
    return getRemesasRequirements()
  }

  if (lower.includes('cuánto') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('comisión') || lower.includes('comision')) {
    return getRemesasCost()
  }

  // If we have domain data, use it
  const remesasContent = REMESAS_ENTRIES.map(e => e.content).join('\n\n')
  if (remesasContent) {
    return `${remesasContent}\n\n¿Te gustaría iniciar una remesa? Indícame: moneda de origen, monto, destino, y datos del receptor.`
  }

  // Ultimate fallback — never empty refinement
  return getRemesasFullProtocol()
}

function getRemesasFullProtocol(): string {
  return `Te explico los servicios de remesas disponibles:

📦 **Servicios Ofrecidos:**
• Envío de divisas (USD, EUR, MLC) desde Estados Unidos a Cuba
• Recogida en efectivo en puntos autorizados en Cuba
• Depósito en cuentas bancarias cubanas
• Entrega a domicilio (según cobertura)

📋 **Para iniciar una remesa necesito que me indiques:**
1. **Moneda de origen** — ¿USD, EUR, u otra?
2. **Cantidad** — ¿Cuánto deseas enviar?
3. **Origen** — ¿Desde dónde envías? (ciudad/estado)
4. **Destino** — ¿A qué provincia de Cuba?
5. **Método de entrega** — ¿Efectivo, depósito bancario, o entrega a domicilio?
6. **Receptor** — ¿Nombre completo y datos de contacto del receptor?

¿Qué deseas hacer?`
}

function getRemesasServices(): string {
  return `Los servicios de remesas disponibles incluyen:

• **Envío USD → CUP**: Transferencia desde Estados Unidos con entrega en efectivo en Cuba.
• **Envío USD → MLC**: Cambio a MLC con depósito en cuenta bancaria cubana.
• **Envío EUR → CUP**: Desde Europa a Cuba con recogida en efectivo.
• **Recogida en Ventanilla**: El receptor retira en un Cajero MSM autorizado.
• **Entrega a Domicilio**: Llevamos el efectivo hasta la puerta del receptor (sujeto a cobertura).

¿Te gustaría iniciar alguna de estas opciones?`
}

function getRemesasRates(): string {
  return `Las tasas de cambio aplicables a remesas varían según el método de entrega y el volumen. Los tipos disponibles son:

• USD → CUP (efectivo)
• USD → MLC (depósito bancario)
• EUR → CUP (efectivo)
• EUR → MLC (depósito bancario)

**Importante:** Las tasas se actualizan periódicamente. Para darte la tasa exacta del momento, necesito que me indiques:
- Moneda de origen y destino
- Monto a enviar
- Método de entrega deseado

¿Qué operación te interesa?`
}

function getRemesasRequirements(): string {
  return `Para realizar una remesa a Cuba se requiere:

**Remitente:**
• Identificación oficial vigente (pasaporte o ID)
• Comprobante de origen de fondos (para montos superiores a $2,000 USD)

**Receptor:**
• Nombre completo
• Número de identidad (CI) cubano
• Teléfono de contacto en Cuba
• Dirección de entrega

**Para montos mayores a $5,000 USD** pueden requerirse documentos adicionales según regulaciones aplicables.

¿Tienes estos datos listos?`
}

function getRemesasCost(): string {
  return `El costo de las remesas varía según:

• **Monto enviado**: A mayor monto, menor porcentaje de comisión.
• **Método de entrega**: Efectivo, depósito bancario o entrega a domicilio.
• **Velocidad**: Servicio estándar (48-72h) o express (24h).

Para darte un estimado preciso, necesito saber: ¿qué monto deseas enviar y a qué provincia de Cuba?`
}
