export interface VillaPhase {
  id: string
  name: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  budget: number
  spent: number
  startDate: string
  endDate?: string
  description: string
  milestones: VillaMilestone[]
}

export interface VillaMilestone {
  id: string
  name: string
  phaseId: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  targetDate: string
  completedDate?: string
  description: string
}

export interface VillaCabin {
  id: string
  name: string
  capacity: number
  price: number
  available: boolean
  image: string
  description: string
  amenities: string[]
}

export interface VillaContribution {
  id: string
  donor: string
  amount: number
  currency: 'USD' | 'PTS' | 'Crypto'
  date: string
  type: 'donation' | 'commitment' | 'investment'
  verified: boolean
}

const VILLA_PHASES: VillaPhase[] = [
  {
    id: 'phase-1',
    name: 'Terreno y Cimentación',
    status: 'not_started',
    budget: 500000,
    spent: 0,
    startDate: '2026-09-01',
    description: 'Adquisición del terreno, estudios de suelo, permisos de construcción y cimentación de Villa Azul.',
    milestones: [
      { id: 'm1-1', name: 'Estudio de suelo completado', phaseId: 'phase-1', status: 'pending', targetDate: '2026-09-15', description: 'Contratar y completar estudio geotécnico del terreno.' },
      { id: 'm1-2', name: 'Permisos municipales', phaseId: 'phase-1', status: 'pending', targetDate: '2026-10-01', description: 'Obtener todos los permisos de construcción requeridos.' },
      { id: 'm1-3', name: 'Inicio de cimentación', phaseId: 'phase-1', status: 'pending', targetDate: '2026-10-15', description: 'Comenzar obras de cimentación de Villa Azul.' },
    ],
  },
  {
    id: 'phase-2',
    name: 'Villa Azul — Estructura',
    status: 'not_started',
    budget: 1500000,
    spent: 0,
    startDate: '2026-11-01',
    description: 'Construcción de la estructura principal de Villa Azul: habitaciones, áreas sociales, piscina infinita.',
    milestones: [
      { id: 'm2-1', name: 'Estructura principal', phaseId: 'phase-2', status: 'pending', targetDate: '2026-12-15', description: 'Completar estructura de hormigón de Villa Azul.' },
      { id: 'm2-2', name: 'Piscina infinita', phaseId: 'phase-2', status: 'pending', targetDate: '2027-01-15', description: 'Construcción y acabado de piscina infinita.' },
    ],
  },
  {
    id: 'phase-3',
    name: 'Cabañas de Lujo',
    status: 'not_started',
    budget: 1200000,
    spent: 0,
    startDate: '2027-01-01',
    description: 'Construcción de 10 cabañas de lujo con capacidad para 4-6 personas cada una.',
    milestones: [
      { id: 'm3-1', name: 'Cabañas 1-5', phaseId: 'phase-3', status: 'pending', targetDate: '2027-03-01', description: 'Completar primeras 5 cabañas.' },
      { id: 'm3-2', name: 'Cabañas 6-10', phaseId: 'phase-3', status: 'pending', targetDate: '2027-05-01', description: 'Completar cabañas restantes.' },
    ],
  },
  {
    id: 'phase-4',
    name: 'Santuario Sagrado',
    status: 'not_started',
    budget: 800000,
    spent: 0,
    startDate: '2027-03-01',
    description: 'Construcción del santuario, áreas de meditación, oración y agenda espiritual.',
    milestones: [
      { id: 'm4-1', name: 'Santuario', phaseId: 'phase-4', status: 'pending', targetDate: '2027-05-15', description: 'Completar santuario principal.' },
    ],
  },
  {
    id: 'phase-5',
    name: 'Árbol de la Vida y Jardines',
    status: 'not_started',
    budget: 500000,
    spent: 0,
    startDate: '2027-04-01',
    description: 'Creación del Árbol de la Vida, jardines, senderos y áreas verdes.',
    milestones: [
      { id: 'm5-1', name: 'Árbol de la Vida', phaseId: 'phase-5', status: 'pending', targetDate: '2027-06-01', description: 'Instalación del monumento Árbol de la Vida.' },
    ],
  },
  {
    id: 'phase-6',
    name: 'Infraestructura y Servicios',
    status: 'not_started',
    budget: 500000,
    spent: 0,
    startDate: '2026-10-01',
    description: 'Instalaciones eléctricas, agua, internet, seguridad y servicios básicos.',
    milestones: [
      { id: 'm6-1', name: 'Servicios básicos', phaseId: 'phase-6', status: 'pending', targetDate: '2027-02-01', description: 'Completar instalaciones de agua, luz e internet.' },
    ],
  },
]

export const VILLA_CABINS: VillaCabin[] = [
  { id: 'c1', name: 'Cabaña del Amanecer', capacity: 4, price: 250, available: true, image: '/assets/zafiro/villa-cabana-1.webp', description: 'Vista al amanecer, jacuzzi privado y terraza con hamaca.', amenities: ['Jacuzzi', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'Terraza'] },
  { id: 'c2', name: 'Cabaña del Bosque', capacity: 6, price: 350, available: true, image: '/assets/zafiro/villa-cabana-2.webp', description: 'Rodeada de naturaleza, fogata exterior y habitación principal con vista al jardín.', amenities: ['Fogata', 'WiFi', 'Aire acondicionado', 'Parrilla', 'Estacionamiento'] },
  { id: 'c3', name: 'Cabaña del Arcoíris', capacity: 4, price: 300, available: false, image: '/assets/zafiro/villa-cabana-3.webp', description: 'Decoración artística, piscina privada y galería de arte local.', amenities: ['Piscina privada', 'WiFi', 'Aire acondicionado', 'Galería', 'Terraza'] },
  { id: 'c4', name: 'Cabaña de la Luna', capacity: 2, price: 200, available: true, image: '/assets/zafiro/villa-cabana-4.webp', description: 'Intimidad total, cielo abierto para observación de estrellas.', amenities: ['Cielo abierto', 'WiFi', 'Aire acondicionado', 'Minibar', 'Terraza'] },
  { id: 'c5', name: 'Cabaña Familiar', capacity: 8, price: 500, available: true, image: '/assets/zafiro/villa-cabana-5.webp', description: 'Espacio familiar completo con juegos, piscina y área de parrilla.', amenities: ['Piscina', 'Juegos infantiles', 'Parrilla', 'WiFi', 'Cocina completa'] },
]

export function getVillaPhases(): VillaPhase[] {
  if (typeof window === 'undefined') return VILLA_PHASES
  const stored = localStorage.getItem('zafiro_villa_phases')
  if (stored) return JSON.parse(stored)
  return VILLA_PHASES
}

export function getVillaCabins(): VillaCabin[] {
  return VILLA_CABINS
}

export function getVillaContributions(): VillaContribution[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('zafiro_villa_contributions')
  return stored ? JSON.parse(stored) : []
}

export function addVillaContribution(c: VillaContribution): void {
  const list = getVillaContributions()
  list.push(c)
  localStorage.setItem('zafiro_villa_contributions', JSON.stringify(list))
}

export function getVillaProgress(): { totalBudget: number; totalSpent: number; phaseCount: number; completedPhases: number } {
  const phases = getVillaPhases()
  return {
    totalBudget: phases.reduce((s, p) => s + p.budget, 0),
    totalSpent: phases.reduce((s, p) => s + p.spent, 0),
    phaseCount: phases.length,
    completedPhases: phases.filter(p => p.status === 'completed').length,
  }
}

export function getVillaFinancialSummary(): { goalUsd: number; raisedUsd: number; committedUsd: number; donorCount: number } {
  const contributions = getVillaContributions()
  const verified = contributions.filter(c => c.verified && c.currency === 'USD')
  return {
    goalUsd: 5000000,
    raisedUsd: verified.reduce((s, c) => s + c.amount, 0),
    committedUsd: contributions.filter(c => !c.verified && c.currency === 'USD').reduce((s, c) => s + c.amount, 0),
    donorCount: new Set(contributions.map(c => c.donor)).size,
  }
}

export const SANCTUARY_INFO = {
  name: 'Santuario Sagrado',
  description: 'Un espacio de paz, oración y conexión espiritual en el corazón de Villa Esperanza. Diseñado para la meditación, el recogimiento y la sanación del alma.',
  norms: [
    'Silencio en áreas de meditación',
    'Vestimenta adecuada y respetuosa',
    'No fotografías durante ceremonias',
    'Apagar dispositivos electrónicos',
    'Respetar horarios de actividades',
  ],
  schedule: [
    { time: '06:00', activity: 'Meditación del Amanecer' },
    { time: '07:00', activity: 'Oración matutina' },
    { time: '09:00', activity: 'Taller de sanación' },
    { time: '12:00', activity: 'Silencio sagrado' },
    { time: '15:00', activity: 'Círculo de gratitud' },
    { time: '18:00', activity: 'Oración del Atardecer' },
    { time: '20:00', activity: 'Círculo de estrellas' },
  ],
  history: 'Villa Esperanza nace de la visión de Don Miguel Soria Martínez como un espacio de sanación holística, donde cuerpo, mente y espíritu encuentran equilibrio. El Santuario Sagrado es su corazón espiritual.',
}
