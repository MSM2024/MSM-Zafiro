const TRADING_KEY = "zafiro_trading_1pct"

export interface TradingConfig {
  capitalTotalUSD: number
  riesgoPorOperacion: number
  parBase: string
  activosCrypto: string[]
  activosBolsa: string[]
  modo: "manual" | "semi-automatico" | "automatico"
}

export interface SenalTrading {
  id: string
  activo: string
  tipo: "compra" | "venta"
  precioEntrada: number
  takeProfit: number
  stopLoss: number
  cantidadUSD: number
  confianza: number
  razon: string
  timestamp: string
  estado: "pendiente" | "aprobada" | "ejecutada" | "rechazada" | "expirada"
}

export interface Operacion {
  id: string
  activo: string
  tipo: "compra" | "venta"
  precioEntrada: number
  precioSalida: number | null
  cantidad: number
  cantidadUSD: number
  resultadoUSD: number | null
  resultadoPct: number | null
  apertura: string
  cierre: string | null
  estado: "abierta" | "cerrada" | "cancelada"
  plataforma: string
}

const TOP_10_CRYPTO = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "ADA", "AVAX", "DOGE", "DOT"]

export function getConfig(): TradingConfig {
  if (typeof window === "undefined") return defaultConfig()
  try {
    return JSON.parse(localStorage.getItem(TRADING_KEY) || "null") || defaultConfig()
  } catch {
    return defaultConfig()
  }
}

function defaultConfig(): TradingConfig {
  return {
    capitalTotalUSD: 10000,
    riesgoPorOperacion: 0.01,
    parBase: "USDT",
    activosCrypto: TOP_10_CRYPTO,
    activosBolsa: [],
    modo: "semi-automatico",
  }
}

export function saveConfig(cfg: TradingConfig): void {
  localStorage.setItem(TRADING_KEY, JSON.stringify(cfg))
}

export function calcularCapitalPorOperacion(): number {
  const cfg = getConfig()
  return cfg.capitalTotalUSD * cfg.riesgoPorOperacion
}

export function generarSenal(
  activo: string,
  precioActual: number,
  tendencia: "alcista" | "bajista" | "lateral",
  rsi: number,
  volumenRelativo: number
): SenalTrading {
  const cfg = getConfig()
  const cantidadUSD = calcularCapitalPorOperacion()
  const confianzaBase = tendencia === "alcista" ? 0.7 : tendencia === "bajista" ? 0.3 : 0.5
  const confianzaRSI = rsi < 30 ? 0.8 : rsi > 70 ? 0.2 : 0.5
  const confianzaVol = volumenRelativo > 1.5 ? 0.8 : 0.4
  const confianza = Math.round((confianzaBase + confianzaRSI + confianzaVol) / 3 * 100) / 100

  const tipo = tendencia === "alcista" && rsi < 40 ? "compra"
    : tendencia === "bajista" && rsi > 60 ? "venta"
    : confianza > 0.6 ? (tendencia === "alcista" ? "compra" : "venta")
    : "compra"

  const tpMultiplier = tipo === "compra" ? 1.05 : 0.95
  const slMultiplier = tipo === "compra" ? 0.98 : 1.02
  const takeProfit = Math.round(precioActual * tpMultiplier * 100) / 100
  const stopLoss = Math.round(precioActual * slMultiplier * 100) / 100

  const razones: string[] = []
  if (tendencia === "alcista") razones.push("Tendencia alcista detectada")
  if (rsi < 30) razones.push("RSI en zona de sobreventa")
  if (rsi > 70) razones.push("RSI en zona de sobrecompra")
  if (volumenRelativo > 1.5) razones.push("Volumen anormalmente alto")
  razones.push(`Operación al ${cfg.riesgoPorOperacion * 100}% del capital`)

  return {
    id: `senal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    activo,
    tipo,
    precioEntrada: precioActual,
    takeProfit,
    stopLoss,
    cantidadUSD,
    confianza,
    razon: razones.join(". "),
    timestamp: new Date().toISOString(),
    estado: "pendiente",
  }
}

export function getHistorialOperaciones(): Operacion[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("zafiro_trading_ops") || "[]")
  } catch {
    return []
  }
}

export function registrarOperacion(op: Omit<Operacion, "id">): Operacion {
  const ops = getHistorialOperaciones()
  const entry: Operacion = { ...op, id: `op_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }
  ops.unshift(entry)
  localStorage.setItem("zafiro_trading_ops", JSON.stringify(ops))
  return entry
}

export function getResumenTrading(): string {
  const cfg = getConfig()
  const porOp = calcularCapitalPorOperacion()
  const ops = getHistorialOperaciones()
  const ganadas = ops.filter((o) => o.resultadoUSD && o.resultadoUSD > 0)
  const perdidas = ops.filter((o) => o.resultadoUSD && o.resultadoUSD < 0)
  const totalPct = ops.reduce((s, o) => s + (o.resultadoPct || 0), 0)
  const winRate = ops.length > 0 ? Math.round((ganadas.length / ops.length) * 100) : 0

  return `📈 *Estrategia de Trading 1% — ELIANA*

*Configuración:*
• Capital: $${cfg.capitalTotalUSD.toFixed(2)} USD
• Riesgo/Op: ${cfg.riesgoPorOperacion * 100}% ($${porOp.toFixed(2)})
• Par base: ${cfg.parBase}
• Modo: ${cfg.modo}

*Activos monitoreados:*
${cfg.activosCrypto.map((a) => `  • ${a}`).join("\n")}

*Estadísticas:*
• Operaciones totales: ${ops.length}
• Win Rate: ${winRate}%
• Retorno total: ${totalPct >= 0 ? "+" : ""}${totalPct.toFixed(2)}%
• Ganadas: ${ganadas.length} | Perdidas: ${perdidas.length}

*Regla de oro:* 1% del capital por operación. Sin excepciones. 🛡️`
}

export function getMensajeAnalisis(precioBTC: number, tendencia: string, rsi: number, volumen: number): string {
  const senal = generarSenal("BTC", precioBTC, tendencia as any, rsi, volumen)
  return `🔍 *Análisis de Mercado — ELIANA*

*BTC/USDT:* $${precioBTC.toFixed(2)}
*Tendencia:* ${tendencia}
*RSI:* ${rsi}
*Volumen:* ${volumen > 1.5 ? "Alto" : "Normal"}

*Señal generada:*
• ${senal.tipo === "compra" ? "🟢 COMPRA" : "🔴 VENTA"} ${senal.activo}
• Precio: $${senal.precioEntrada.toFixed(2)}
• TP: $${senal.takeProfit.toFixed(2)} | SL: $${senal.stopLoss.toFixed(2)}
• Cantidad: $${senal.cantidadUSD.toFixed(2)} USD
• Confianza: ${Math.round(senal.confianza * 100)}%
• Razón: ${senal.razon}

*Recuerda:* 1% del capital. Siempre. ¿Apruebas esta operación?`
}
