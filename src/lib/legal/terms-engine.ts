// Legal Engine — Documentos legales versionados
// Frecuencia 369-777
// Cada versión tiene: fecha, autor, estado, contenido, auditoría

export type LegalDocType = 'terms' | 'privacy' | 'community_rules'
export type LegalStatus = 'active' | 'archived' | 'draft'

export interface LegalDocument {
  id: string
  type: LegalDocType
  version: number
  title: string
  content: string
  summary: string
  author: string
  status: LegalStatus
  createdAt: string
  updatedAt: string
  supersedes?: string // id of previous version
}

export interface LegalAuditEntry {
  id: string
  docId: string
  action: 'created' | 'activated' | 'archived' | 'updated'
  by: string
  timestamp: string
}

const DOCS_KEY = 'zafiro_legal_docs'
const AUDIT_KEY = 'zafiro_legal_audit'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadDocs(): LegalDocument[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(DOCS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveDocs(docs: LegalDocument[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
}

function loadAudit(): LegalAuditEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAudit(entries: LegalAuditEntry[]): void {
  if (typeof window === 'undefined') return
  if (entries.length > 1000) entries.splice(0, entries.length - 1000)
  localStorage.setItem(AUDIT_KEY, JSON.stringify(entries))
}

function recordAudit(docId: string, action: LegalAuditEntry['action'], by: string): LegalAuditEntry {
  const entry: LegalAuditEntry = {
    id: generateId(),
    docId,
    action,
    by,
    timestamp: new Date().toISOString(),
  }
  const audit = loadAudit()
  audit.push(entry)
  saveAudit(audit)
  return entry
}

const TERMS_V1: LegalDocument = {
  id: 'terms-v1',
  type: 'terms',
  version: 1,
  title: 'Términos y Condiciones de Uso de ZAFIRO MSM',
  content: `TÉRMINOS Y CONDICIONES DE USO DE ZAFIRO MSM

Versión 1.0 — Vigente desde Julio 2026

MSM MY STORE LLC
Sitio: https://zafiro.msmmystore.com/

1. ALCANCE
Estos términos regulan el uso de ZAFIRO, la red social digital de MSM MY STORE LLC, sus perfiles, historias, sponsors, herramientas IA, proyectos, publicaciones, comunicaciones y funciones conectadas.

2. ACEPTACIÓN
Al usar ZAFIRO, el usuario acepta cumplir estos términos, políticas de privacidad, reglas comunitarias, condiciones comerciales y actualizaciones publicadas por MSM MY STORE LLC.

3. CUENTAS Y PERFILES
3.1 El usuario debe proporcionar información verdadera al registrarse.
3.2 Cada usuario es responsable de proteger su cuenta, dispositivo, contraseña y accesos.
3.3 MSM puede suspender cuentas que usen fraude, suplantación, abuso, spam, estafa, violencia, contenido ilegal o uso no autorizado.
3.4 El perfil owner (com8msm@gmail.com) pertenece al OWNER_SUPERADMIN y controla configuraciones principales de ZAFIRO.

4. CONTENIDO DEL USUARIO
4.1 El usuario conserva responsabilidad sobre lo que publica.
4.2 No se permite contenido ilegal, violento, sexual, explotador, discriminatorio, difamatorio, fraudulento o que viole derechos de terceros.
4.3 Las historias, publicaciones, imágenes, videos, comentarios y enlaces pueden ser moderados, eliminados, archivados o restringidos por seguridad.
4.4 El usuario autoriza a ZAFIRO a mostrar su contenido dentro de la plataforma según la privacidad seleccionada.

5. HISTORIAS Y PERFILES
5.1 Las historias pueden incluir texto, imagen, video, enlaces, promociones, proyectos o sponsors autorizados.
5.2 Las historias pueden expirar automáticamente o guardarse como destacadas según configuración.
5.3 ZAFIRO puede registrar vistas, reacciones, clics, compartidos y eventos para mejorar experiencia y seguridad.
5.4 No se permiten historias con enlaces peligrosos, spam, fraude, contenido falso o material no autorizado.

6. SPONSORS
6.1 Los sponsors pueden ser internos de MSM o externos autorizados.
6.2 Todo sponsor debe tener nombre, descripción, imagen, enlace, categoría, estado, fecha y botón funcional.
6.3 ZAFIRO puede medir impresiones, clics, conversiones, ubicación aproximada, dispositivo y origen del evento.
6.4 No se mostrarán sponsors expirados, pausados, archivados o no aprobados.
6.5 ELIANA solo puede explicar sponsors guardados como ACTIVE y no debe inventar patrocinadores, enlaces ni beneficios.

7. IA — ELIANA
7.1 ELIANA es asistente inteligente de apoyo. No sustituye decisiones humanas, legales, médicas, financieras, contables ni regulatorias.
7.2 ELIANA puede organizar información, responder preguntas, crear borradores, orientar proyectos y ayudar con procesos autorizados.
7.3 ELIANA no aprueba pagos, no mueve dinero, no firma documentos por el usuario y no confirma operaciones sin validación real.
7.4 Las respuestas de IA pueden ser revisadas, corregidas y auditadas por MSM.
7.5 El usuario acepta que ciertas conversaciones puedan usarse para mejorar seguridad, calidad y funcionamiento de ZAFIRO según privacidad aplicable.

8. SERVICIOS COMERCIALES
8.1 Precios, tasas, inventario, tiempos de entrega, disponibilidad y condiciones pueden cambiar.
8.2 Toda operación de dinero, cambio, remesa, pago, liquidación o entrega requiere validación, comprobante y autorización correspondiente.
8.3 MSM no garantiza una tasa, precio, inventario o entrega si no está confirmada por una fuente oficial vigente.
8.4 Reclamos, disputas, devoluciones y ajustes se procesan según políticas internas y evidencia disponible.

9. PRIVACIDAD Y DATOS
9.1 ZAFIRO recopila datos necesarios para cuenta, seguridad, comunicación, servicios, analíticas, auditoría y mejora de experiencia.
9.2 Los datos pueden incluir nombre, teléfono, correo, perfil, dispositivo, IP aproximada, actividad, publicaciones, eventos y preferencias.
9.3 Datos sensibles, financieros, documentos, ubicación exacta o comprobantes se protegen con controles adicionales.
9.4 La geolocalización precisa solo se usa con consentimiento cuando la función lo requiera.
9.5 MSM no debe vender datos personales sensibles y debe aplicar medidas razonables de seguridad.

10. SEGURIDAD
10.1 Se aplican autenticación, permisos, roles, RLS, auditoría, cifrado en tránsito y controles contra abuso.
10.2 El usuario no puede intentar acceder a cuentas, datos, sistemas, APIs, claves o áreas no autorizadas.
10.3 Queda prohibido extraer datos, usar bots no autorizados, manipular métricas, explotar vulnerabilidades o interferir con la plataforma.
10.4 MSM puede bloquear, revocar, limitar o investigar accesos por seguridad.

11. PROPIEDAD INTELECTUAL
11.1 MSM MY STORE LLC, ZAFIRO, ELIANA, Cajeros MSM, Mente Maestra, La Suiza de Cuba, Villa Esperanza y marcas relacionadas pertenecen a sus titulares autorizados.
11.2 El usuario no puede copiar, explotar, revender o usar la identidad visual, tecnología, textos, marcas o contenido de MSM sin autorización.
11.3 El contenido creado por usuarios sigue bajo responsabilidad del usuario y debe respetar derechos de terceros.

12. LIMITACIÓN DE RESPONSABILIDAD
12.1 ZAFIRO se ofrece como plataforma digital en desarrollo y puede tener mantenimiento, errores, interrupciones, cambios o actualizaciones.
12.2 MSM no responde por pérdidas causadas por uso indebido, datos falsos, accesos no autorizados, fuerza mayor, fallos externos o decisiones tomadas sin confirmación humana.
12.3 Nada en ZAFIRO debe interpretarse como promesa garantizada de resultado financiero, legal, técnico, espiritual, comercial o médico.

13. ACTUALIZACIONES
13.1 MSM puede actualizar estos términos, políticas y funciones.
13.2 Las actualizaciones entran en vigor cuando se publiquen en la plataforma o se notifique al usuario.
13.3 El uso continuo de ZAFIRO implica aceptación de la versión vigente.

14. CONTACTO
Empresa: MSM MY STORE LLC
Sitio: https://zafiro.msmmystore.com/
Soporte: Canales oficiales de MSM MY STORE LLC
Escalado: PERSONA o DON MIGUEL`,
  summary: 'Términos que regulan el uso de ZAFIRO MSM: cuentas, contenido, historias, sponsors, IA ELIANA, servicios comerciales, privacidad, seguridad y propiedad intelectual.',
  author: 'MSM MY STORE LLC',
  status: 'active' as LegalStatus,
  createdAt: '2026-07-17T00:00:00.000Z',
  updatedAt: '2026-07-17T00:00:00.000Z',
}

const PRIVACY_V1: LegalDocument = {
  id: 'privacy-v1',
  type: 'privacy',
  version: 1,
  title: 'Política de Privacidad de ZAFIRO MSM',
  content: `POLÍTICA DE PRIVACIDAD DE ZAFIRO MSM

Versión 1.0 — Vigente desde Julio 2026

MSM MY STORE LLC

1. DATOS RECOPILADOS
ZAFIRO recopila la siguiente información necesaria para el funcionamiento de la plataforma: nombre, correo electrónico, teléfono, nombre de usuario, foto de perfil, biografía, ubicación general, actividad en la plataforma, publicaciones, historias, comentarios, reacciones, preferencias de membresía, dispositivo, dirección IP aproximada, y datos de navegación.

2. USO DE LOS DATOS
Los datos se utilizan para: crear y gestionar la cuenta, proporcionar los servicios de la plataforma, procesar membresías y pagos, mejorar la experiencia de usuario, enviar comunicaciones relacionadas con el servicio, generar analíticas internas, auditar la plataforma, y cumplir con obligaciones legales.

3. DATOS SENSIBLES
Los datos financieros, documentos de identidad, ubicación exacta y comprobantes se protegen con controles adicionales de seguridad. La geolocalización precisa solo se recolecta con consentimiento explícito del usuario cuando la función lo requiera.

4. COMPARTIR DATOS
MSM MY STORE LLC no vende datos personales sensibles a terceros. Los datos pueden compartirse con: procesadores de pago (Stripe), proveedores de infraestructura (Vercel, Supabase), y autoridades competentes cuando la ley lo requiera.

5. SEGURIDAD
Se aplican medidas razonables de seguridad: cifrado en tránsito (TLS), autenticación de usuarios, control de acceso basado en roles (RBAC), auditoría de eventos críticos, y políticas de retención de datos.

6. DERECHOS DEL USUARIO
El usuario puede: acceder a sus datos personales, solicitar corrección de datos inexactos, solicitar eliminación de su cuenta y datos, exportar sus datos, y retirar consentimiento para ciertos procesamientos.

7. RETENCIÓN
Los datos se conservan mientras la cuenta esté activa y hasta 12 meses después de su desactivación, salvo obligación legal de retenerlos por más tiempo.

8. CONTACTO
Para ejercer derechos de privacidad: Canales oficiales de MSM MY STORE LLC.`,
  summary: 'Política de privacidad de ZAFIRO MSM: datos recopilados, uso, datos sensibles, seguridad y derechos del usuario.',
  author: 'MSM MY STORE LLC',
  status: 'active' as LegalStatus,
  createdAt: '2026-07-17T00:00:00.000Z',
  updatedAt: '2026-07-17T00:00:00.000Z',
}

const RULES_V1: LegalDocument = {
  id: 'community-rules-v1',
  type: 'community_rules',
  version: 1,
  title: 'Reglas de la Comunidad ZAFIRO MSM',
  content: `REGLAS DE LA COMUNIDAD ZAFIRO MSM

Versión 1.0 — Vigente desde Julio 2026

1. RESPETO
Trata a todos los miembros con respeto. No se permite acoso, discriminación, amenazas ni lenguaje de odio.

2. AUTENTICIDAD
Usa tu identidad real. No suplantes personas, marcas o entidades. No crees cuentas falsas.

3. CONTENIDO
Comparte contenido apropiado. No publiques material ilegal, violento, sexualmente explícito, engañoso o que infrinja derechos de autor.

4. SPAM
No hagas spam. No publiques enlaces no autorizados, mensajes repetitivos, promociones no aprobadas o cadenas de mensajes.

5. PRIVACIDAD
Respeta la privacidad de otros miembros. No compartas información personal de otros sin su consentimiento.

6. PROPIEDAD INTELECTUAL
Respeta los derechos de propiedad intelectual. No reproduzcas contenido protegido sin autorización.

7. REPORTES
Reporta contenido inapropiado. Usa los canales oficiales para reportar violaciones a estas reglas.

8. CONSECUENCIAS
Las violaciones pueden resultar en: advertencia, suspensión temporal, eliminación de contenido, o cancelación permanente de la cuenta.`,
  summary: 'Reglas comunitarias de ZAFIRO MSM: respeto, autenticidad, contenido, spam, privacidad y consecuencias.',
  author: 'MSM MY STORE LLC',
  status: 'active' as LegalStatus,
  createdAt: '2026-07-17T00:00:00.000Z',
  updatedAt: '2026-07-17T00:00:00.000Z',
}

// Seed on first load
function ensureSeeded(): void {
  const docs = loadDocs()
  if (docs.length > 0) return

  const seedDocs = [TERMS_V1, PRIVACY_V1, RULES_V1]
  saveDocs(seedDocs)
  for (const doc of seedDocs) {
    recordAudit(doc.id, 'created', 'system')
    recordAudit(doc.id, 'activated', 'system')
  }
}

export function getActiveDocument(type: LegalDocType): LegalDocument | undefined {
  ensureSeeded()
  return loadDocs().find(d => d.type === type && d.status === 'active')
}

export function getAllDocuments(type?: LegalDocType): LegalDocument[] {
  ensureSeeded()
  const docs = loadDocs()
  return type ? docs.filter(d => d.type === type) : docs
}

export function getDocumentById(id: string): LegalDocument | undefined {
  ensureSeeded()
  return loadDocs().find(d => d.id === id)
}

export function addDocument(
  type: LegalDocType,
  title: string,
  content: string,
  summary: string,
  author: string,
): LegalDocument {
  ensureSeeded()
  const docs = loadDocs()
  const lastVersion = docs.filter(d => d.type === type).length
  const doc: LegalDocument = {
    id: `${type}-v${lastVersion + 1}`,
    type,
    version: lastVersion + 1,
    title,
    content,
    summary,
    author,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  docs.push(doc)
  saveDocs(docs)
  recordAudit(doc.id, 'created', author)
  return doc
}

export function activateDocument(id: string, by: string): LegalDocument | null {
  const docs = loadDocs()
  const doc = docs.find(d => d.id === id)
  if (!doc) return null

  // Archive current active of same type
  for (const d of docs) {
    if (d.type === doc.type && d.status === 'active' && d.id !== id) {
      d.status = 'archived'
      d.supersedes = id
    }
  }

  doc.status = 'active'
  doc.updatedAt = new Date().toISOString()
  saveDocs(docs)
  recordAudit(id, 'activated', by)
  return doc
}

export function archiveDocument(id: string, by: string): LegalDocument | null {
  const docs = loadDocs()
  const doc = docs.find(d => d.id === id)
  if (!doc) return null
  doc.status = 'archived'
  doc.updatedAt = new Date().toISOString()
  saveDocs(docs)
  recordAudit(id, 'archived', by)
  return doc
}

export function getLegalAudit(docId?: string): LegalAuditEntry[] {
  const audit = loadAudit()
  return docId ? audit.filter(a => a.docId === docId) : audit
}

export function getTermsContext(): string {
  const terms = getActiveDocument('terms')
  const privacy = getActiveDocument('privacy')
  const rules = getActiveDocument('community_rules')
  const parts: string[] = []
  if (terms) parts.push(`📜 Términos (v${terms.version}): ${terms.summary}`)
  if (privacy) parts.push(`🔒 Privacidad (v${privacy.version}): ${privacy.summary}`)
  if (rules) parts.push(`📋 Reglas (v${rules.version}): ${rules.summary}`)
  return parts.join('\n')
}

export function formatLegalForPrompt(): string {
  const terms = getActiveDocument('terms')
  if (!terms) return ''
  return `TÉRMINOS Y CONDICIONES ACTIVOS (v${terms.version}):\n${terms.summary}\n\nNo inventes condiciones comerciales ni beneficios no cubiertos en los términos activos.`
}
