'use client'

export interface Seal {
  numero: number
  slug: string
  referencia: string
  versiculo: string
  tema: string
  reflexion: string
  declaracion: string
  oracion: string
  pregunta: string
  accion: string
  estado: 'draft' | 'published' | 'archived'
  orden: number
}

export interface UserSealProgress {
  sealId: number
  status: 'unread' | 'reading' | 'completed'
  openedAt: string | null
  completedAt: string | null
}

export interface JournalEntry {
  id: string
  sealId: number
  content: string
  createdAt: string
}

export interface ReadingPlan {
  planType: 'daily_150' | 'weekly' | 'random'
  startedAt: string
  currentSeal: number
  completedAt: string | null
}

const SEALS_KEY = 'zafiro_seals'
const PROGRESS_KEY = 'zafiro_seal_progress'
const FAVORITES_KEY = 'zafiro_seal_favorites'
const JOURNAL_KEY = 'zafiro_seal_journal'
const PLAN_KEY = 'zafiro_reading_plan'
const TODAY_SEAL_KEY = 'zafiro_today_seal'

export const THEMES = [
  'Protección', 'Confianza', 'Justicia', 'Misericordia', 'Sabiduría',
  'Restauración', 'Adoración', 'Esperanza', 'Propósito', 'Familia',
  'Batalla espiritual', 'Paz', 'Gratitud', 'Dirección', 'Perdón', 'Eternidad'
] as const

export const THEME_COLORS: Record<string, string> = {
  'Protección': 'text-blue-400',
  'Confianza': 'text-emerald-400',
  'Justicia': 'text-amber-400',
  'Misericordia': 'text-pink-400',
  'Sabiduría': 'text-purple-400',
  'Restauración': 'text-teal-400',
  'Adoración': 'text-yellow-400',
  'Esperanza': 'text-green-400',
  'Propósito': 'text-indigo-400',
  'Familia': 'text-orange-400',
  'Batalla espiritual': 'text-red-400',
  'Paz': 'text-sky-400',
  'Gratitud': 'text-rose-400',
  'Dirección': 'text-cyan-400',
  'Perdón': 'text-violet-400',
  'Eternidad': 'text-gold-400',
}

export const SEED_SEALS: Seal[] = [
  {
    numero: 1, slug: 'salmo-1-6',
    referencia: 'Salmo 1:6',
    versiculo: 'Porque Jehová conoce el camino de los justos, mas la senda de los malos perecerá.',
    tema: 'Dirección',
    reflexion: 'Dios conoce cada paso, cada batalla, cada lágrima y cada decisión. El camino del justo no está perdido porque permanece bajo la mirada y dirección del Altísimo. No necesitas tener todas las respuestas hoy — necesitas saber que Él conoce tu camino.',
    declaracion: 'Yo camino bajo la mirada de Dios. Mi camino es conocido por el Altísimo. No estoy perdido, no camino solo. Dios guía mis pasos y dirige mi destino.',
    oracion: 'Padre amado, abre mis ojos para comprender tu Palabra. Dirige mis pasos, fortalece mi fe y convierte este sello en luz para mi camino. En el nombre de Jesús, amén.',
    pregunta: '¿Qué área de mi vida debo confiar hoy completamente a Dios?',
    accion: 'Escribe una decisión que entregarás hoy en oración.',
    estado: 'published', orden: 1
  },
  {
    numero: 2, slug: 'salmo-2-12',
    referencia: 'Salmo 2:12',
    versiculo: 'Honrad al Hijo, para que no se enoje, y perezcáis en el camino; pues se inflama de repente su ira. Bienaventurados todos los que en él confían.',
    tema: 'Confianza',
    reflexion: 'La verdadera bienaventuranza no está en el poder humano ni en las estrategias terrenales. Está en confiar en el Hijo. En un mundo que te invita a confiar en ti mismo, en tus recursos o en tus conexiones, el salmista recuerda que la bendición verdadera pertenece a los que depositan su confianza en Dios.',
    declaracion: 'Yo soy bienaventurado porque confío en el Hijo. Mi seguridad no está en lo que poseo sino en Aquel a quien pertenezco.',
    oracion: 'Señor, enséñame a confiar no en mis fuerzas sino en tu amor. Que mi corazón descanse en la certeza de que tú eres mi refugio. Amén.',
    pregunta: '¿Dónde estoy depositando mi confianza hoy?',
    accion: 'Identifica una preocupación y entrégala en confianza a Dios.',
    estado: 'published', orden: 2
  },
  {
    numero: 3, slug: 'salmo-3-8',
    referencia: 'Salmo 3:8',
    versiculo: 'La salvación es de Jehová; sobre tu pueblo sea tu bendición.',
    tema: 'Protección',
    reflexion: 'David escribió este salmo huyendo de su propio hijo Absalón. En el momento más oscuro de su vida familiar y política, declaró que la salvación pertenece a Jehová. No hay enemigo, circunstancia ni traición que esté fuera del alcance de la salvación de Dios.',
    declaracion: 'Mi salvación viene de Jehová. Su bendición está sobre mi vida. No importa quién se levante contra mí, Dios es mi libertador.',
    oracion: 'Dios de salvación, en medio de mis batallas levanto mis ojos a ti. Sé tú mi escudo y mi libertador. Amén.',
    pregunta: '¿De qué situación necesito que Dios me salve hoy?',
    accion: 'Escribe el nombre de una persona o situación que necesitas entregar a Dios para que él actúe.',
    estado: 'published', orden: 3
  },
  {
    numero: 4, slug: 'salmo-4-8',
    referencia: 'Salmo 4:8',
    versiculo: 'En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado.',
    tema: 'Paz',
    reflexion: 'Pocas cosas son tan difíciles como dormir en paz cuando el alma está turbada. David descubrió el secreto: la confianza en Dios produce una paz que no depende de las circunstancias externas. Puedes acostarte en medio de la tormenta si tu confianza está en el que calma la tormenta.',
    declaracion: 'En paz me acuesto y en paz duermo, porque solo Jehová me hace vivir confiado. Mi paz no depende de mis circunstancias sino de mi Dios.',
    oracion: 'Señor, enséñame a descansar en ti. Que mi corazón encuentre paz en tu presencia, y que mi sueño sea dulce porque tú velas por mí. Amén.',
    pregunta: '¿Qué me está robando la paz hoy?',
    accion: 'Antes de dormir, escribe tres cosas por las que estás agradecido y entrégale tus cargas a Dios.',
    estado: 'published', orden: 4
  },
  {
    numero: 5, slug: 'salmo-5-12',
    referencia: 'Salmo 5:12',
    versiculo: 'Porque tú, oh Jehová, bendecirás al justo; como con un escudo lo rodearás de tu favor.',
    tema: 'Protección',
    reflexion: 'El favor de Dios no es una recompensa lejana sino un escudo presente. La palabra "rodearás" describe una cobertura completa. No hay punto ciego en la protección de Dios sobre sus hijos. Su favor te envuelve por completo.',
    declaracion: 'Jehová me bendice y me rodea con su favor como un escudo. Estoy cubierto, protegido y bendecido por el Altísimo.',
    oracion: 'Padre, gracias porque tu favor me rodea como un escudo. Ayúdame a vivir consciente de tu protección y bendición cada día. Amén.',
    pregunta: '¿Cómo has experimentado el favor de Dios esta semana?',
    accion: 'Reconoce en voz alta una bendición que hayas recibido hoy.',
    estado: 'published', orden: 5
  },
  {
    numero: 6, slug: 'salmo-6-10',
    referencia: 'Salmo 6:10',
    versiculo: 'Todos mis enemigos serán avergonzados y turbarán mucho; volveránse y serán avergonzados de repente.',
    tema: 'Batalla espiritual',
    reflexion: 'David no negaba la realidad de sus enemigos, pero afirmaba la realidad más grande de la intervención divina. La batalla no termina con el triunfo del mal sino con la justicia de Dios. La vergüenza del enemigo es la vindicación del justo.',
    declaracion: 'Dios es mi defensor. Los que se levantan contra mí serán avergonzados, porque Jehová pelea por mí.',
    oracion: 'Señor, tú conoces a los que se levantan contra mí. Pelea tú mis batallas y muéstrate fuerte en mi debilidad. Amén.',
    pregunta: '¿Qué batalla estoy tratando de pelear solo?',
    accion: 'Identifica una lucha que necesitas entregar a Dios hoy.',
    estado: 'published', orden: 6
  },
  {
    numero: 7, slug: 'salmo-7-17',
    referencia: 'Salmo 7:17',
    versiculo: 'Alabaré a Jehová conforme a su justicia, y cantaré al nombre de Jehová el Altísimo.',
    tema: 'Adoración',
    reflexion: 'La alabanza no es solo una canción, es una declaración de justicia. David decidió alabar no cuando todo estaba bien sino como un acto de fe. La alabanza reconoce que Dios es justo incluso cuando no entendemos sus caminos.',
    declaracion: 'Alabaré a Jehová conforme a su justicia. Cantaré a su nombre porque él es el Altísimo y su justicia perfecta.',
    oracion: 'Dios Altísimo, te alabo porque eres justo. Aunque no entienda todos tus caminos, confío en tu justicia y te adoro. Amén.',
    pregunta: '¿Qué aspecto de la justicia de Dios puedo alabar hoy aunque no lo entienda completamente?',
    accion: 'Escoge una canción de alabanza y cántala como un acto de fe.',
    estado: 'published', orden: 7
  },
  {
    numero: 8, slug: 'salmo-8-9',
    referencia: 'Salmo 8:9',
    versiculo: 'Jehová, Señor nuestro, ¡cuán grande es tu nombre en toda la tierra!',
    tema: 'Adoración',
    reflexion: 'El Salmo 8 comienza y termina con la misma declaración de asombro. Al considerar los cielos, la luna y las estrellas, David se maravilla de que el Creador del universo se acuerde del ser humano. La grandeza de Dios se revela tanto en la inmensidad del cosmos como en la intimidad de su cuidado por nosotros.',
    declaracion: 'Jehová, Señor nuestro, cuán grande es tu nombre en toda la tierra. Me maravillo de que tú, siendo tan grande, te acuerdes de mí.',
    oracion: 'Señor, dueño del universo, gracias porque en medio de tu inmensidad te preocupas por mí. Que mi vida refleje la grandeza de tu nombre. Amén.',
    pregunta: '¿Cuándo fue la última vez que me maravillé de la grandeza de Dios?',
    accion: 'Sal hoy a mirar el cielo y declara la grandeza de Dios.',
    estado: 'published', orden: 8
  },
  {
    numero: 9, slug: 'salmo-9-20',
    referencia: 'Salmo 9:20',
    versiculo: 'Ponlos en temor, oh Jehová; conozcan las naciones que son humanos.',
    tema: 'Justicia',
    reflexion: 'El salmista pide que las naciones reconozcan su humanidad y su límite. Hay una sabiduría profunda en recordar que somos humanos, no dioses. El temor de Dios nos devuelve a nuestro lugar correcto: criaturas dependientes del Creador. Ese reconocimiento es el principio de la verdadera justicia.',
    declaracion: 'Reconozco que soy humano y que Dios es Dios. Me humillo ante su grandeza y confío en su justicia.',
    oracion: 'Señor, ayúdame a recordar mi lugar. Que no confíe en mi fuerza sino en tu poder. Que el temor de Dios sea el principio de mi sabiduría. Amén.',
    pregunta: '¿En qué áreas de mi vida estoy actuando como si no necesitara a Dios?',
    accion: 'Haz una lista de áreas de tu vida donde necesitas rendirte a la autoridad de Dios.',
    estado: 'published', orden: 9
  },
  {
    numero: 10, slug: 'salmo-10-18',
    referencia: 'Salmo 10:18',
    versiculo: 'Para juzgar al huérfano y al pobre, para que no vuelva más a hacer violencia el hombre de la tierra.',
    tema: 'Justicia',
    reflexion: 'Dios no solo ve la injusticia, actúa. Su corazón está con los más vulnerables: el huérfano y el pobre. La promesa no es solo de juicio sino de un cese definitivo de la violencia. Dios está comprometido con la restauración completa de su creación.',
    declaracion: 'Dios defiende al huérfano y al pobre. Su justicia es mi esperanza, y su reino pondrá fin a toda violencia.',
    oracion: 'Dios de justicia, despierta en mí un corazón como el tuyo por los vulnerables. Úsame para ser instrumento de tu justicia y amor. Amén.',
    pregunta: '¿Cómo puedo ser la respuesta de Dios al necesitado que está cerca de mí?',
    accion: 'Realiza una acción concreta de ayuda hacia alguien que lo necesite hoy.',
    estado: 'published', orden: 10
  },
]

export function getSeals(): Seal[] {
  if (typeof window === 'undefined') return SEED_SEALS
  try {
    const stored = localStorage.getItem(SEALS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return SEED_SEALS
}

export function saveSeals(seals: Seal[]) {
  localStorage.setItem(SEALS_KEY, JSON.stringify(seals))
}

export function getPublishedSeals(): Seal[] {
  return getSeals().filter(s => s.estado === 'published')
}

export function getSealByNumber(num: number): Seal | undefined {
  return getSeals().find(s => s.numero === num)
}

export function getRandomSeal(): Seal | undefined {
  const published = getPublishedSeals()
  if (!published.length) return undefined
  return published[Math.floor(Math.random() * published.length)]
}

export function getProgress(): UserSealProgress[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')
  } catch { return [] }
}

export function saveProgress(progress: UserSealProgress[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function markSealProgress(sealId: number, status: 'unread' | 'reading' | 'completed') {
  const progress = getProgress()
  const idx = progress.findIndex(p => p.sealId === sealId)
  const now = new Date().toISOString()
  const entry: UserSealProgress = {
    sealId, status,
    openedAt: status === 'reading' || status === 'completed' ? now : null,
    completedAt: status === 'completed' ? now : null,
  }
  if (idx >= 0) {
    const existing = progress[idx]
    progress[idx] = { ...existing, ...entry }
    if (status === 'completed' && !existing.completedAt) progress[idx].completedAt = now
    if (status === 'reading' && !existing.openedAt) progress[idx].openedAt = now
  } else {
    progress.push(entry)
  }
  saveProgress(progress)

  if (status === 'completed') {
    try {
      const seal = getSealByNumber(sealId)
      const { addNotification } = require("@/lib/notifications")
      addNotification({
        title: `Sello #${sealId} completado`,
        message: seal?.tema || `Sello #${sealId} — reflexión completada`,
        type: "success",
        pillar: "sellos",
        read: false,
        actionUrl: `/sellos/${sealId}`,
      })
    } catch {}
  }
}

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch { return [] }
}

export function saveFavorites(favorites: number[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function toggleFavorite(sealId: number): boolean {
  const favs = getFavorites()
  const idx = favs.indexOf(sealId)
  if (idx >= 0) { favs.splice(idx, 1); saveFavorites(favs); return false }
  else { favs.push(sealId); saveFavorites(favs); return true }
}

export function getJournal(): JournalEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]')
  } catch { return [] }
}

export function saveJournalEntry(sealId: number, content: string): JournalEntry {
  const journal = getJournal()
  const entry: JournalEntry = {
    id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
    sealId, content,
    createdAt: new Date().toISOString(),
  }
  journal.push(entry)
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal))
  return entry
}

export function deleteJournalEntry(id: string) {
  const journal = getJournal().filter(e => e.id !== id)
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal))
}

export function getReadingPlan(): ReadingPlan | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(PLAN_KEY) || 'null')
  } catch { return null }
}

export function saveReadingPlan(plan: ReadingPlan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
}

export function getTodaySeal(): number | null {
  const stored = localStorage.getItem(TODAY_SEAL_KEY)
  if (!stored) return null
  const data = JSON.parse(stored)
  const today = new Date().toDateString()
  if (data.date === today) return data.sealId
  return null
}

export function setTodaySeal(sealId: number) {
  localStorage.setItem(TODAY_SEAL_KEY, JSON.stringify({
    date: new Date().toDateString(),
    sealId,
  }))
}

export function getCompletionStats() {
  const seals = getPublishedSeals()
  const progress = getProgress()
  const completed = progress.filter(p => p.status === 'completed').length
  const reading = progress.filter(p => p.status === 'reading').length
  const favorites = getFavorites().length
  const journal = getJournal()
  const total = seals.length
  return { total, completed, reading, favorites, journalCount: journal.length, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
}

export function resetAllSeals() {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(FAVORITES_KEY)
  localStorage.removeItem(JOURNAL_KEY)
  localStorage.removeItem(PLAN_KEY)
  localStorage.removeItem(TODAY_SEAL_KEY)
}
