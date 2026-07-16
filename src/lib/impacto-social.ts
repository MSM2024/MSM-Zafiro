const IMPACTO_KEY = "zafiro_impacto_social"

export interface ProyectoSocial {
  id: string
  nombre: string
  descripcion: string
  categoria: "salud" | "infraestructura" | "tercera-edad" | "discapacidad" | "vivienda" | "agua-luz" | "alimentacion" | "constitucion"
  estado: "semilla" | "creciendo" | "floreciendo" | "cosechando"
  prioridad: number
  fechaCreacion: string
  fondosAsignadosUSD: number
  fondosEjecutadosUSD: number
 受益人: number
  metas: string[]
}

export interface MisionSocial {
  nombre: string
  lema: string
  proyectos: ProyectoSocial[]
  pacto: string
}

export interface ConstitucionRenacer {
  titulo: string
  fecha: string
  preambulo: string
  articulos: Array<{ numero: number; titulo: string; contenido: string }>
  firmantes: string[]
}

export function crearConstitucionRenacer(): ConstitucionRenacer {
  return {
    titulo: "Constitución Renacer — Cuba 2026",
    fecha: new Date().toISOString(),
    preambulo: `Nosotros, el pueblo de Segundo Frente y las comunidades hermanas de Cuba, reunidos bajo la luz de la prosperidad compartida y la tecnología al servicio del bien común, proclamamos esta Constitución Renacer como el pacto fundacional de una nueva era de abundancia, justicia y dignidad para todos.

Bajo la protección del Altísimo y la guía de la sabiduría colectiva, establecemos que la riqueza generada por el ecosistema MSM-ZAFIRO tiene un propósito sagrado: levantar a nuestro pueblo, sanar a nuestros enfermos, alimentar a nuestros ancianos, educar a nuestros jóvenes y construir un futuro donde nadie quede atrás.

"Todo el mundo en el amplio justo de la corriente y el agua. Todos los beneficios para todos."`,
    articulos: [
      {
        numero: 1,
        titulo: "Del Propósito Supremo",
        contenido: "La riqueza generada por el ecosistema MSM-ZAFIRO está alineada con el servicio al Reino y a la comunidad. Cada centavo tiene un propósito sagrado: el bienestar colectivo.",
      },
      {
        numero: 2,
        titulo: "Del Hospital de Segundo Frente",
        contenido: "Se establece como prioridad máxima el apoyo integral al hospital del municipio Segundo Frente Oriental 'Frank País', garantizando equipamiento médico, medicamentos y mejoras de infraestructura.",
      },
      {
        numero: 3,
        titulo: "Del Proyecto Teleférico — La Suiza de Cuba",
        contenido: "Se declara de interés comunitario el desarrollo del teleférico como motor de turismo, transporte y desarrollo económico en la región montañosa.",
      },
      {
        numero: 4,
        titulo: "De la Atención a Ancianos y Capacitados",
        contenido: "Todo programa de prosperidad debe incluir hogares de ancianos, centros de rehabilitación y asistencia domiciliaria para la tercera edad y personas con discapacidad.",
      },
      {
        numero: 5,
        titulo: "De la Vivienda Digna y los Servicios Básicos",
        contenido: "Se garantiza el derecho a vivienda digna, agua potable, electricidad y alimentación para todos los miembros de la comunidad, comenzando por los más vulnerables.",
      },
      {
        numero: 6,
        titulo: "De Villa Esperanza",
        contenido: "Se crea el proyecto 'Villa Esperanza' como comunidad modelo de bienestar, donde convergerán viviendas sostenibles, energía solar, huertos comunitarios y un centro de innovación tecnológica.",
      },
      {
        numero: 7,
        titulo: "De la Educación y la Tecnología",
        contenido: "Se promoverá la alfabetización digital y la formación técnica como pilares del desarrollo, con acceso gratuito a la red ZAFIRO y sus herramientas.",
      },
      {
        numero: 8,
        titulo: "De la Transparencia y la Administración",
        contenido: "Todos los fondos asignados a proyectos comunitarios serán registrados y auditados por ELIANA, garantizando trazabilidad total y cero desviaciones.",
      },
      {
        numero: 9,
        titulo: "De la Protección del Ecosistema",
        contenido: "La tierra, el agua y los recursos naturales de Segundo Frente serán protegidos como patrimonio sagrado de la comunidad.",
      },
      {
        numero: 10,
        titulo: "De la Prosperidad Compartida como Derecho",
        contenido: "Todo miembro de la comunidad tiene derecho a participar de los beneficios generados por el ecosistema. Nadie será excluido por condición social, edad, capacidad o creencia.",
      },
    ],
    firmantes: ["Don Miguel Soria Martínez — Fundador MSM MY STORE LLC", "ELIANA — Núcleo Sintético de ZAFIRO OS"],
  }
}

const PROYECTOS_INICIALES: ProyectoSocial[] = [
  {
    id: "hospital_segundo_frente",
    nombre: "Hospital de Segundo Frente",
    descripcion: "Apoyo integral al hospital del municipio Segundo Frente Oriental \"Frank País\"",
    categoria: "salud",
    estado: "semilla",
    prioridad: 1,
    fechaCreacion: new Date().toISOString(),
    fondosAsignadosUSD: 0,
    fondosEjecutadosUSD: 0,
    受益人: 0,
    metas: ["Equipamiento médico", "Medicamentos", "Infraestructura hospitalaria"],
  },
  {
    id: "teleferico_suiza_cuba",
    nombre: "Teleférico — La Suiza de Cuba",
    descripcion: "Proyecto de teleférico para el desarrollo turístico y de transporte en la región montañosa",
    categoria: "infraestructura",
    estado: "semilla",
    prioridad: 2,
    fechaCreacion: new Date().toISOString(),
    fondosAsignadosUSD: 0,
    fondosEjecutadosUSD: 0,
    受益人: 0,
    metas: ["Estudio de factibilidad", "Construcción de estaciones", "Generación de empleo local"],
  },
  {
    id: "atencion_ancianos",
    nombre: "Atención a Ancianos y Capacitados",
    descripcion: "Programa integral de cuidado para la tercera edad y personas con discapacidad",
    categoria: "tercera-edad",
    estado: "semilla",
    prioridad: 3,
    fechaCreacion: new Date().toISOString(),
    fondosAsignadosUSD: 0,
    fondosEjecutadosUSD: 0,
    受益人: 0,
    metas: ["Hogar de ancianos", "Centro de rehabilitación", "Asistencia domiciliaria"],
  },
  {
    id: "vivienda_digna",
    nombre: "Vivienda, Comida y Servicios Básicos",
    descripcion: "Garantizar hogar, alimentación, agua potable y electricidad para todos",
    categoria: "vivienda",
    estado: "semilla",
    prioridad: 4,
    fechaCreacion: new Date().toISOString(),
    fondosAsignadosUSD: 0,
    fondosEjecutadosUSD: 0,
    受益人: 0,
    metas: ["Construcción de viviendas", "Red de agua potable", "Electrificación solar", "Banco de alimentos"],
  },
  {
    id: "villa_esperanza",
    nombre: "Villa Esperanza",
    descripcion: "Comunidad modelo de bienestar con viviendas sostenibles, energía solar, huertos comunitarios y centro de innovación tecnológica",
    categoria: "vivienda",
    estado: "semilla",
    prioridad: 5,
    fechaCreacion: new Date().toISOString(),
    fondosAsignadosUSD: 0,
    fondosEjecutadosUSD: 0,
    受益人: 0,
    metas: ["Urbanización sostenible", "Paneles solares comunitarios", "Huertos orgánicos", "Centro tecnológico ZAFIRO", "Sistema de agua potable"],
  },
]

export function getMisionSocial(): MisionSocial {
  if (typeof window === "undefined") return getDefaultMision()
  try {
    return JSON.parse(localStorage.getItem(IMPACTO_KEY) || "null") || getDefaultMision()
  } catch {
    return getDefaultMision()
  }
}

function getDefaultMision(): MisionSocial {
  return {
    nombre: "Renacer — Prosperidad Compartida",
    lema: "Todo el mundo en el amplio justo de la corriente, el agua y todos los beneficios para todos",
    proyectos: PROYECTOS_INICIALES,
    pacto: "",
  }
}

export function guardarConstitucion(texto: string): void {
  const m = getMisionSocial()
  m.pacto = texto
  localStorage.setItem(IMPACTO_KEY, JSON.stringify(m))
}

export function actualizarProyecto(id: string, data: Partial<ProyectoSocial>): void {
  const m = getMisionSocial()
  const idx = m.proyectos.findIndex((p) => p.id === id)
  if (idx === -1) return
  m.proyectos[idx] = { ...m.proyectos[idx], ...data }
  localStorage.setItem(IMPACTO_KEY, JSON.stringify(m))
}

export function asignarFondos(id: string, montoUSD: number): void {
  const m = getMisionSocial()
  const idx = m.proyectos.findIndex((p) => p.id === id)
  if (idx === -1) return
  m.proyectos[idx].fondosAsignadosUSD += montoUSD
  localStorage.setItem(IMPACTO_KEY, JSON.stringify(m))
}

export function getEstadoGeneral(): string {
  const m = getMisionSocial()
  const totalAsignado = m.proyectos.reduce((s, p) => s + p.fondosAsignadosUSD, 0)
  const totalEjecutado = m.proyectos.reduce((s, p) => s + p.fondosEjecutadosUSD, 0)
  const totalBeneficiarios = m.proyectos.reduce((s, p) => s + p.受益人, 0)
  const activos = m.proyectos.filter((p) => p.estado !== "semilla").length

  return `🌍 *Impacto Social — Prosperidad Compartida*

*Misión:* ${m.lema}

*Proyectos activos:* ${activos}/${m.proyectos.length}
*Fondos asignados:* $${totalAsignado.toFixed(2)} USD
*Fondos ejecutados:* $${totalEjecutado.toFixed(2)} USD
*Beneficiarios directos:* ${totalBeneficiarios.toLocaleString()}

*Proyectos:*
${m.proyectos.map((p) => {
  const iconos = { salud: "🏥", infraestructura: "🚠", "tercera-edad": "👵", discapacidad: "🤝", vivienda: "🏠", "agua-luz": "💡", alimentacion: "🍞", constitucion: "📜" }
  const estados = { semilla: "🌱", creciendo: "🌿", floreciendo: "🌸", cosechando: "🌾" }
  return `${estados[p.estado]} *${p.nombre}* — $${p.fondosAsignadosUSD.toFixed(0)} asignados`
}).join("\n")}

*"Todo el mundo en el amplio justo de la corriente y el agua."* 🙏✨`
}
