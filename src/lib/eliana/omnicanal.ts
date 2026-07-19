// Modelo de Datos Omnicanal — ELIANA v1.0.2
// Directorio, Expedientes, Inventario Vivo, Reportes
// Frecuencia 369

import { generateCorrelationId } from './correlation'
import { serverGetItem, serverSetItem, serverGetJSON, serverSetJSON } from './server-store'

// ─── Storage adapter ───

function storage(): Storage {
  if (typeof window !== 'undefined') return localStorage
  return { getItem: serverGetItem, setItem: serverSetItem, removeItem: (_k: string) => {}, clear: () => {}, length: 0, key: (_i: number) => null } as unknown as Storage
}

function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = storage().getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function setJSON(key: string, value: unknown): void {
  storage().setItem(key, JSON.stringify(value))
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ─── Tipos Compartidos ───

export type CanalTipo = 'whatsapp' | 'web' | 'telegram' | 'voice' | 'grupal'
export type EntidadTipo = 'cliente' | 'colaborador' | 'proveedor' | 'grupo' | 'canal'
export type PaisTipo = 'Cuba' | 'USA' | 'Panama' | 'Mexico' | 'Other'
export type MonedaTipo = 'CUP' | 'USD' | 'EUR' | 'MLC' | 'USDT'
export type MovimientoDireccion = 'entrada' | 'salida'
export type MovimientoCategoria = 'producto' | 'equipo' | 'comision' | 'gasto' | 'apartado' | 'transferencia'

// ─── 1. Directorio ───

export interface DirectorioEntry {
  id: string
  tipo: EntidadTipo
  nombre: string
  alias: string
  pais: PaisTipo
  ciudad: string
  telefono: string
  email: string
  canalPreferido: CanalTipo
  tags: string[]
  permisos: string[]
  notas: string
  activo: boolean
  creado: string
  actualizado: string
}

const DIR_KEY = 'zafiro_directorio'

export function getDirectorio(filtro?: { tipo?: EntidadTipo; pais?: PaisTipo; activo?: boolean }): DirectorioEntry[] {
  let entries: DirectorioEntry[] = getJSON(DIR_KEY, [])
  if (filtro?.tipo) entries = entries.filter(e => e.tipo === filtro.tipo)
  if (filtro?.pais) entries = entries.filter(e => e.pais === filtro.pais)
  if (filtro?.activo !== undefined) entries = entries.filter(e => e.activo === filtro.activo)
  return entries
}

export function addDirectorioEntry(entry: Omit<DirectorioEntry, 'id' | 'creado' | 'actualizado'>): DirectorioEntry {
  const entries = getDirectorio()
  const nueva: DirectorioEntry = { ...entry, id: generateId(), creado: new Date().toISOString(), actualizado: new Date().toISOString() }
  entries.push(nueva)
  setJSON(DIR_KEY, entries)
  return nueva
}

export function updateDirectorioEntry(id: string, data: Partial<DirectorioEntry>): DirectorioEntry | null {
  const entries = getDirectorio()
  const idx = entries.findIndex(e => e.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...data, actualizado: new Date().toISOString() }
  setJSON(DIR_KEY, entries)
  return entries[idx]
}

export function getDirectorioStats(): { total: number; porTipo: Record<EntidadTipo, number>; porPais: Record<PaisTipo, number> } {
  const entries = getDirectorio()
  const porTipo: Record<string, number> = {}
  const porPais: Record<string, number> = {}
  for (const e of entries) {
    porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1
    porPais[e.pais] = (porPais[e.pais] || 0) + 1
  }
  return { total: entries.length, porTipo: porTipo as Record<EntidadTipo, number>, porPais: porPais as Record<PaisTipo, number> }
}

// ─── 2. Expedientes ───

export interface Expediente {
  id: string
  entityId: string
  entityTipo: EntidadTipo
  titulo: string
  permisos: string[]
  estado: 'abierto' | 'pendiente' | 'completado' | 'archivado'
  operacionesPendientes: OperacionPendiente[]
  comprobantes: Comprobante[]
  eventos: EventoExpediente[]
  notas: string
  creado: string
  actualizado: string
}

export interface OperacionPendiente {
  id: string
  tipo: string
  descripcion: string
  montoUsd: number
  moneda: MonedaTipo
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  creado: string
  confirmado?: string
}

export interface Comprobante {
  id: string
  tipo: string
  referencia: string
  montoUsd: number
  moneda: MonedaTipo
  archivo?: string
  estado: 'recibido' | 'verificado' | 'rechazado'
  creado: string
  verificado?: string
}

export interface EventoExpediente {
  id: string
  accion: string
  detalle: string
  responsable: string
  timestamp: string
}

const EXP_KEY = 'zafiro_expedientes'

export function getExpedientes(filtro?: { entityId?: string; estado?: string }): Expediente[] {
  let entries: Expediente[] = getJSON(EXP_KEY, [])
  if (filtro?.entityId) entries = entries.filter(e => e.entityId === filtro.entityId)
  if (filtro?.estado) entries = entries.filter(e => e.estado === filtro.estado)
  return entries
}

export function addExpediente(exp: Omit<Expediente, 'id' | 'creado' | 'actualizado'>): Expediente {
  const entries = getExpedientes()
  const nuevo: Expediente = { ...exp, id: generateId(), creado: new Date().toISOString(), actualizado: new Date().toISOString() }
  entries.push(nuevo)
  setJSON(EXP_KEY, entries)
  return nuevo
}

export function addOperacionPendiente(expedienteId: string, op: Omit<OperacionPendiente, 'id' | 'creado'>): Expediente | null {
  const entries = getExpedientes()
  const exp = entries.find(e => e.id === expedienteId)
  if (!exp) return null
  exp.operacionesPendientes.push({ ...op, id: generateId(), creado: new Date().toISOString() })
  exp.actualizado = new Date().toISOString()
  setJSON(EXP_KEY, entries)
  return exp
}

export function confirmarOperacion(expedienteId: string, opId: string): Expediente | null {
  const entries = getExpedientes()
  const exp = entries.find(e => e.id === expedienteId)
  if (!exp) return null
  const op = exp.operacionesPendientes.find(o => o.id === opId)
  if (!op) return null
  op.estado = 'confirmada'
  op.confirmado = new Date().toISOString()
  exp.actualizado = new Date().toISOString()
  setJSON(EXP_KEY, entries)
  return exp
}

export function addComprobante(expedienteId: string, comp: Omit<Comprobante, 'id' | 'creado'>): Expediente | null {
  const entries = getExpedientes()
  const exp = entries.find(e => e.id === expedienteId)
  if (!exp) return null
  exp.comprobantes.push({ ...comp, id: generateId(), creado: new Date().toISOString() })
  exp.actualizado = new Date().toISOString()
  setJSON(EXP_KEY, entries)
  return exp
}

export function addEventoExpediente(expedienteId: string, evento: Omit<EventoExpediente, 'id' | 'timestamp'>): Expediente | null {
  const entries = getExpedientes()
  const exp = entries.find(e => e.id === expedienteId)
  if (!exp) return null
  exp.eventos.push({ ...evento, id: generateId(), timestamp: new Date().toISOString() })
  exp.actualizado = new Date().toISOString()
  setJSON(EXP_KEY, entries)
  return exp
}

// ─── 3. Inventario Vivo ───

export interface MovimientoInventario {
  id: string
  categoria: MovimientoCategoria
  direccion: MovimientoDireccion
  concepto: string
  cantidad: number
  moneda: MonedaTipo
  monto: number
  responsable: string
  expedienteId?: string
  evidencia: string
  fecha: string
  estado: 'pendiente' | 'confirmado' | 'corregido'
  correccionDe?: string
  valorAnterior?: { cantidad: number; monto: number }
}

const INV_KEY = 'zafiro_inventario_movimientos'

export function getMovimientos(
  filtro?: { categoria?: MovimientoCategoria; moneda?: MonedaTipo; estado?: string; desde?: string; hasta?: string }
): MovimientoInventario[] {
  let movs: MovimientoInventario[] = getJSON(INV_KEY, [])
  if (filtro?.categoria) movs = movs.filter(m => m.categoria === filtro.categoria)
  if (filtro?.moneda) movs = movs.filter(m => m.moneda === filtro.moneda)
  if (filtro?.estado) movs = movs.filter(m => m.estado === filtro.estado)
  if (filtro?.desde) movs = movs.filter(m => m.fecha >= filtro.desde!)
  if (filtro?.hasta) movs = movs.filter(m => m.fecha <= filtro.hasta!)
  return movs
}

export function addMovimiento(mov: Omit<MovimientoInventario, 'id'>): MovimientoInventario {
  const movs = getMovimientos()
  const nuevo: MovimientoInventario = { ...mov, id: generateId() }
  movs.push(nuevo)
  setJSON(INV_KEY, movs)
  return nuevo
}

export function confirmarMovimiento(id: string): MovimientoInventario | null {
  const movs = getMovimientos()
  const mov = movs.find(m => m.id === id)
  if (!mov) return null
  mov.estado = 'confirmado'
  setJSON(INV_KEY, movs)
  return mov
}

export function corregirMovimiento(id: string, correccion: { cantidad: number; monto: number }): MovimientoInventario | null {
  const movs = getMovimientos()
  const mov = movs.find(m => m.id === id)
  if (!mov) return null
  const nueva: MovimientoInventario = {
    ...mov, id: generateId(), estado: 'corregido',
    correccionDe: id, valorAnterior: { cantidad: mov.cantidad, monto: mov.monto },
    cantidad: correccion.cantidad, monto: correccion.monto,
  }
  mov.estado = 'corregido'
  movs.push(nueva)
  setJSON(INV_KEY, movs)
  return nueva
}

export interface ResumenInventario {
  porMoneda: Record<MonedaTipo, { entradas: number; salidas: number; saldo: number }>
  porCategoria: Record<MovimientoCategoria, { cantidad: number; montoUsd: number }>
  pendientes: number
}

export function getResumenInventario(): ResumenInventario {
  const movs = getMovimientos()
  const monedas: MonedaTipo[] = ['CUP', 'USD', 'EUR', 'MLC', 'USDT']
  const categorias: MovimientoCategoria[] = ['producto', 'equipo', 'comision', 'gasto', 'apartado', 'transferencia']

  const porMoneda: Record<string, { entradas: number; salidas: number; saldo: number }> = {}
  const porCategoria: Record<string, { cantidad: number; montoUsd: number }> = {}

  for (const m of monedas) {
    const filtrados = movs.filter(mv => mv.moneda === m && mv.estado === 'confirmado')
    porMoneda[m] = {
      entradas: filtrados.filter(mv => mv.direccion === 'entrada').reduce((s, mv) => s + mv.monto, 0),
      salidas: filtrados.filter(mv => mv.direccion === 'salida').reduce((s, mv) => s + mv.monto, 0),
      saldo: 0,
    }
    porMoneda[m].saldo = porMoneda[m].entradas - porMoneda[m].salidas
  }

  for (const c of categorias) {
    const filtrados = movs.filter(mv => mv.categoria === c && mv.estado === 'confirmado')
    porCategoria[c] = {
      cantidad: filtrados.reduce((s, mv) => s + mv.cantidad, 0),
      montoUsd: filtrados.reduce((s, mv) => s + mv.monto, 0),
    }
  }

  return {
    porMoneda: porMoneda as Record<MonedaTipo, { entradas: number; salidas: number; saldo: number }>,
    porCategoria: porCategoria as Record<MovimientoCategoria, { cantidad: number; montoUsd: number }>,
    pendientes: movs.filter(m => m.estado === 'pendiente').length,
  }
}

export function getAlertasInventario(): Array<{ tipo: string; mensaje: string; severidad: 'alta' | 'media' | 'baja' }> {
  const alertas: Array<{ tipo: string; mensaje: string; severidad: 'alta' | 'media' | 'baja' }> = []
  const resumen = getResumenInventario()

  for (const [moneda, datos] of Object.entries(resumen.porMoneda)) {
    if (datos.saldo < 0) alertas.push({ tipo: 'saldo_negativo', mensaje: `Saldo negativo en ${moneda}: $${datos.saldo.toFixed(2)}`, severidad: 'alta' })
  }

  const pendientesAntiguos = getMovimientos({ estado: 'pendiente' }).filter(m => {
    const dias = (Date.now() - new Date(m.fecha).getTime()) / 86400000
    return dias > 7
  })
  if (pendientesAntiguos.length > 0) alertas.push({ tipo: 'pendientes_vencidos', mensaje: `${pendientesAntiguos.length} movimientos pendientes desde hace más de 7 días`, severidad: 'media' })

  return alertas
}

// ─── 4. Reportes ───

export type PeriodoReporte = 'diario' | 'semanal' | 'mensual'

export interface Reporte {
  id: string
  periodo: PeriodoReporte
  titulo: string
  desde: string
  hasta: string
  generado: string
  datosConfirmados: boolean
  resumen: string
  secciones: ReporteSeccion[]
}

export interface ReporteSeccion {
  titulo: string
  datos: Record<string, unknown>[]
  totales?: Record<string, number>
}

export function generarReporte(periodo: PeriodoReporte, desde: string, hasta: string): Reporte {
  const movs = getMovimientos({ desde, hasta, estado: 'confirmado' })
  const directorio = getDirectorio()
  const expedientes = getExpedientes()

  const entradas = movs.filter(m => m.direccion === 'entrada')
  const salidas = movs.filter(m => m.direccion === 'salida')

  const secciones: ReporteSeccion[] = [
    {
      titulo: 'Movimientos del Período',
      datos: movs.slice(0, 50).map(m => ({
        fecha: m.fecha, concepto: m.concepto, categoria: m.categoria,
        direccion: m.direccion, moneda: m.moneda, monto: m.monto, estado: m.estado,
      })),
      totales: { entradas: entradas.reduce((s, m) => s + m.monto, 0), salidas: salidas.reduce((s, m) => s + m.monto, 0) },
    },
    {
      titulo: 'Directorio - Nuevos Contactos',
      datos: directorio.filter(e => e.creado >= desde && e.creado <= hasta).map(e => ({
        nombre: e.nombre, tipo: e.tipo, pais: e.pais, telefono: e.telefono,
      })),
    },
    {
      titulo: 'Expedientes Activos',
      datos: expedientes.filter(e => e.estado === 'abierto' || e.estado === 'pendiente').map(e => ({
        titulo: e.titulo, entityId: e.entityId, estado: e.estado,
        pendientes: e.operacionesPendientes.filter(o => o.estado === 'pendiente').length,
      })),
    },
  ]

  return {
    id: generateId(),
    periodo,
    titulo: `Reporte ${periodo} — ${desde} a ${hasta}`,
    desde,
    hasta,
    generado: new Date().toISOString(),
    datosConfirmados: true,
    resumen: `${movs.length} movimientos, ${entradas.reduce((s, m) => s + m.monto, 0).toFixed(2)} USD entradas, ${salidas.reduce((s, m) => s + m.monto, 0).toFixed(2)} USD salidas`,
    secciones,
  }
}

// ─── 5. Panel Status ───

export interface PanelStatus {
  eliana: { version: string; activa: boolean; uptime: string; lastSync: string }
  web: { status: 'ok' | 'error'; lastPing: string; buildId: string }
  whatsapp: { status: 'conectado' | 'desconectado' | 'pendiente'; lastMessage: string; totalMessages: number }
  modelo: { version: string; intents: number; knowledgeDocs: number }
  supabase: { configurado: boolean; error: string }
  colas: { pendientes: number; procesados: number; fallidos: number }
  errores: { ultimos: Array<{ timestamp: string; mensaje: string }>; total: number }
  alertas: Array<{ tipo: string; mensaje: string; severidad: string }>
}

export function getPanelStatus(): PanelStatus {
  const alertasInv = getAlertasInventario()
  const traces = getJSON<Array<{ step: string; result: string; timestamp: string; action: string }>>('zafiro_eliana_traces', [])
  const errores = traces.filter(t => t.result === 'error' || t.result === 'blocked').slice(-10).map(t => ({ timestamp: t.timestamp, mensaje: `${t.step}: ${t.action}` }))
  const whatsappAudit = getJSON<Array<{ action: string; timestamp: string }>>('zafiro_audit_events', [])
  const whatsappMessages = whatsappAudit.filter(a => a.action === 'message.sent')
  const lastWAMessage = whatsappMessages.length > 0 ? whatsappMessages[whatsappMessages.length - 1].timestamp : '—'
  const colas = getJSON<Array<{ estado: string }>>('zafiro_inventario_movimientos', [])

  return {
    eliana: { version: '1.0.2', activa: true, uptime: `${Math.floor(process.uptime?.() || 0)}s`, lastSync: new Date().toISOString() },
    web: { status: 'ok', lastPing: new Date().toISOString(), buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev' },
    whatsapp: { status: process.env.WHATSAPP_ACCESS_TOKEN ? 'conectado' : 'pendiente', lastMessage: lastWAMessage, totalMessages: whatsappMessages.length },
    modelo: { version: '1.0.2', intents: 30, knowledgeDocs: 38 },
    supabase: { configurado: !!process.env.NEXT_PUBLIC_SUPABASE_URL, error: !process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Sin credenciales Supabase' : '' },
    colas: { pendientes: colas.filter(c => c.estado === 'pendiente').length, procesados: colas.filter(c => c.estado === 'confirmado').length, fallidos: colas.filter(c => c.estado === 'corregido').length },
    errores: { ultimos: errores, total: errores.length },
    alertas: alertasInv.map(a => ({ tipo: a.tipo, mensaje: a.mensaje, severidad: a.severidad })),
  }
}
