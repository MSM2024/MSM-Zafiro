export const SITE_NAME = "Zafiro by MSM";
export const SITE_TAGLINE = "La red social del conocimiento + IA";
export const SITE_DESCRIPTION = "Zafiro es la red social donde el conocimiento se comparte, la IA responde, los expertos validan y la comunidad construye futuro.";
export const SITE_LEMA = "Cada pregunta construye el futuro.";

export const CATEGORIES = [
  { name: "Tecnología", color: "blue" },
  { name: "Ciencia", color: "violet" },
  { name: "Negocios", color: "green" },
  { name: "Salud", color: "teal" },
  { name: "Historia", color: "amber" },
  { name: "Biblia", color: "violet" },
  { name: "Programación", color: "blue" },
  { name: "Inventos", color: "amber" },
  { name: "Espacio", color: "indigo" },
  { name: "IA", color: "violet" },
];

export const PLANS = [
  { name: "Free", price: "$0", description: "Leer, buscar y hacer preguntas con límites" },
  { name: "Plus", price: "$9.99", description: "Más IA, traducciones, guardados y resúmenes" },
  { name: "Pro", price: "$19.99", description: "Investigación profunda, código, exportar documentos" },
];

export const SPONSOR_MESSAGES = [
  { brand: "AI Academy", text: "Aprende inteligencia artificial con rutas guiadas por preguntas." },
  { brand: "Code Mentor", text: "Resuelve errores de programación con ELIANA y expertos." },
  { brand: "Business Lab", text: "Convierte preguntas de negocio en planes y decisiones." },
  { brand: "Language Boost", text: "Practica inglés traduciendo preguntas reales." },
];

export const CORNER_MESSAGES: Record<string, string> = {
  home: "Cada pregunta construye el futuro. ¿Qué quieres saber hoy?",
  explore: "Explora la curiosidad mundial organizada por categorías.",
  question: "Pregunta. IA responde. Expertos validan. Comunidad construye.",
  communities: "Comunidades inteligentes con IA propia, expertos y mapas de conocimiento.",
  ai: "ELIANA responde, resume, traduce y detecta duplicados.",
  profile: "Zafiro Score, reputación, especialidades, preguntas e insignias.",
  membership: "Planes Free, Plus y Pro. Créditos IA, comunidades premium y patrocinios.",
  sponsor: "Sponsors autoservicio: IA revisa, autoriza, Stripe cobra.",
  auth: "Regístrate con tu WhatsApp. Tu teléfono es tu identidad en Zafiro.",
};
