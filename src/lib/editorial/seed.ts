import { addDevocional, addWriter } from "./storage"
import type { DevocionalCategory } from "./types"

const SEVEN_DEVOCIONALES: Array<{
  title: string
  content: string
  verse: string
  verseRef: string
  author: string
  date: string
  tags: string[]
  readingTimeMinutes: number
  featured: boolean
  category: DevocionalCategory
}> = [
  {
    title: "La Fe que Mueve Montañas",
    content: `La fe no es la ausencia de duda, sino la certeza de que hay algo más grande que nosotros mismos guiando cada paso.\n\nEn el camino del emprendedor digital, la fe se convierte en el motor que nos impulsa cuando los resultados no son inmediatos. Es la confianza en que cada semilla plantada dará fruto en su tiempo.\n\nNo se trata de esperar pasivamente, sino de actuar con la convicción de que el universo conspira a nuestro favor cuando alineamos nuestras acciones con nuestro propósito más elevado.\n\nHoy, da un paso de fe. Haz algo que te acerque a tu visión, aunque no veas el camino completo. La luz se revela paso a paso.`,
    verse: "Porque de cierto os digo que si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible.",
    verseRef: "Mateo 17:20",
    author: "Don Miguel Soria Martínez",
    date: new Date().toISOString().slice(0, 10),
    tags: ["fe", "emprendimiento", "confianza"],
    readingTimeMinutes: 3,
    featured: true,
    category: "fe",
  },
  {
    title: "Esperanza en Tiempos de Incertidumbre",
    content: `La esperanza es el ancla del alma en medio de la tormenta. Cuando todo parece oscuro, es la luz que nos recuerda que el amanecer siempre llega.\n\nEn el mundo digital, la incertidumbre es constante. Algoritmos que cambian, mercados que fluctúan, tecnologías que evolucionan. Pero el emprendedor con esperanza no se aferra a los resultados, sino al proceso.\n\nLa esperanza verdadera no es optimismo ciego. Es la decisión consciente de seguir adelante sabiendo que cada desafío trae consigo una lección y una oportunidad disfrazada.\n\nMantén la esperanza viva. No porque sepas cómo terminará la historia, sino porque confías en el Autor de la historia.`,
    verse: "Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    verseRef: "Jeremías 29:11",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    tags: ["esperanza", "incertidumbre", "fe"],
    readingTimeMinutes: 3,
    featured: false,
    category: "esperanza",
  },
  {
    title: "Propósito: El Norte del Emprendedor",
    content: `El propósito es la brújula que guía todas nuestras decisiones. Sin él, cualquier camino parece correcto, pero ninguno nos lleva a donde realmente queremos estar.\n\nMuchos emprendedores persiguen dinero, fama o reconocimiento. Y aunque estas cosas no son malas en sí mismas, no pueden sostenernos en los momentos difíciles. Solo el propósito trasciende las dificultades.\n\nTu propósito no es lo que haces, sino el porqué lo haces. Es la respuesta a la pregunta: ¿qué impacto quiero tener en el mundo?\n\nCuando conectas tu trabajo diario con tu propósito más profundo, el trabajo se convierte en vocación, y la vocación en misión de vida.`,
    verse: "El corazón del hombre piensa su camino; mas Jehová endereza sus pasos.",
    verseRef: "Proverbios 16:9",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
    tags: ["propósito", "visión", "emprendimiento"],
    readingTimeMinutes: 4,
    featured: false,
    category: "proposito",
  },
  {
    title: "Sabiduría para el Liderazgo Digital",
    content: `La sabiduría no se acumula, se aplica. En la era de la información, el conocimiento está al alcance de todos, pero la sabiduría —el saber cuándo y cómo aplicar ese conocimiento— es escasa.\n\nEl líder sabio no es el que más sabe, sino el que mejor escucha. Escucha a su equipo, a sus clientes, al mercado, y sobre todo, a esa voz interior que a menudo llamamos intuición.\n\nEn el ámbito digital, la sabiduría se manifiesta en la capacidad de discernir entre la urgencia y lo importante, entre la tendencia pasajera y el valor duradero.\n\nBusca sabiduría cada día. No en los manuales de éxito rápido, sino en la experiencia, la reflexión y la conexión con algo más grande que tú.`,
    verse: "Porque Jehová da la sabiduría, y de su boca viene el conocimiento y la inteligencia.",
    verseRef: "Proverbios 2:6",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 259200000).toISOString().slice(0, 10),
    tags: ["sabiduría", "liderazgo", "digital"],
    readingTimeMinutes: 3,
    featured: false,
    category: "sabiduria",
  },
  {
    title: "Gratitud en el Camino",
    content: `La gratitud transforma lo que tenemos en suficiente. En la persecución constante de metas y objetivos, a menudo olvidamos mirar atrás y apreciar cuánto hemos avanzado.\n\nEl emprendedor agradecido atrae más bendiciones no porque el universo premie la gratitud, sino porque una mente agradecida está abierta a reconocer las oportunidades que ya están presentes.\n\nPractica la gratitud no como un ejercicio de pensamiento positivo vacío, sino como una disciplina espiritual que te conecta con la realidad de que cada día es un regalo.\n\nHoy, antes de pedir por lo que quieres, agradece por lo que tienes. Verás cómo cambia tu perspectiva y, con ella, tu realidad.`,
    verse: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.",
    verseRef: "1 Tesalonicenses 5:18",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 345600000).toISOString().slice(0, 10),
    tags: ["gratitud", "perspectiva", "plenitud"],
    readingTimeMinutes: 3,
    featured: false,
    category: "gratitud",
  },
  {
    title: "Transformación Digital con Alma",
    content: `La verdadera transformación no es digital, es interior. La tecnología cambia herramientas, pero el cambio que perdura es el que ocurre en el corazón.\n\nMuchos emprendedores se obsesionan con la transformación digital de sus negocios sin entender que primero deben transformarse a sí mismos. Un negocio no puede ir más allá de donde ha llegado su fundador.\n\nLa transformación comienza con preguntas difíciles: ¿Estoy dispuesto a soltar lo que ya no sirve? ¿A aprender lo que no sé? ¿A pedir ayuda cuando la necesito?\n\nPermite que el proceso de construir tu imperio digital te transforme en la persona que necesita estar al frente de ese imperio. El viaje es tanto sobre quién te conviertes como sobre lo que construyes.`,
    verse: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.",
    verseRef: "Romanos 12:2",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 432000000).toISOString().slice(0, 10),
    tags: ["transformación", "crecimiento", "digital"],
    readingTimeMinutes: 4,
    featured: false,
    category: "transformacion",
  },
  {
    title: "Perseverancia: La Virtud del Constructor",
    content: `La perseverancia no es seguir haciendo lo mismo esperando resultados diferentes. Es la capacidad de mantener el rumbo mientras se ajustan las velas.\n\nTodo gran imperio se construye un ladrillo a la vez. No hay atajos. Las historias de éxito de la noche a la mañana siempre esconden años de trabajo invisible que nadie vio.\n\nEl constructor perseverante entiende que los cimientos toman tiempo. Que cavar profundo no es glamoroso pero es necesario. Que la consistencia supera al talento cuando el talento no es consistente.\n\nNo te rindas cuando los resultados tarden en llegar. Sigue construyendo. Sigue aprendiendo. Sigue avanzando. La cosecha siempre llega para aquellos que siembran con paciencia y riegan con perseverancia.`,
    verse: "No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos.",
    verseRef: "Gálatas 6:9",
    author: "Don Miguel Soria Martínez",
    date: new Date(Date.now() - 518400000).toISOString().slice(0, 10),
    tags: ["perseverancia", "constancia", "construcción"],
    readingTimeMinutes: 3,
    featured: false,
    category: "perseverancia",
  },
]

const DEFAULT_WRITERS = [
  {
    name: "Don Miguel Soria Martínez",
    bio: "Fundador del Imperio MSM, escritor y visionario digital. Autor de 'De Cero a Dueño Digital' y creador del ecosistema ZAFIRO. Apasionado por la convergencia entre la fe, la tecnología y el emprendimiento.",
    avatar: "",
    email: "donmiguel@msmmystore.com",
    specialties: ["emprendimiento", "fe", "transformación digital", "liderazgo"],
    booksPublished: 1,
    socialLinks: [
      { platform: "web", url: "https://msmmystore.com" },
    ],
    verified: true,
  },
]

let seeded = false
export function seedEditorial(force = false): void {
  if (seeded && !force) return
  seeded = true
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("zafiro_devocionales")
  if (existing && !force) return

  for (const d of SEVEN_DEVOCIONALES) {
    const date = d.date || new Date().toISOString().slice(0, 10)
    addDevocional({
      title: d.title,
      content: d.content,
      verse: d.verse,
      verseRef: d.verseRef,
      author: d.author,
      date,
      tags: d.tags,
      readingTimeMinutes: d.readingTimeMinutes,
      featured: d.featured,
    })
  }

  const existingW = localStorage.getItem("zafiro_editorial_writers")
  if (!existingW || force) {
    for (const w of DEFAULT_WRITERS) {
      addWriter(w)
    }
  }
}
