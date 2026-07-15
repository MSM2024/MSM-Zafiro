export type NodeType = "casa" | "tienda" | "vehiculo" | "sensor" | "punto_acceso" | "bodega"

export type DigitalNode = {
  id: string
  type: NodeType
  label: string
  ubicacion: { lat: number; lng: number }
  activo: boolean
  capacidad: number
  consumo: number
  energia: number
  conexiones: string[]
  metadata: Record<string, unknown>
  ultimo_latido: number
}

export type NodeRelation = {
  from: string
  to: string
  tipo: "datos" | "energia" | "logistica" | "social"
  peso: number
  activo: boolean
}

export function createNode(type: NodeType, label: string): DigitalNode {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    ubicacion: { lat: 23.1136, lng: -82.3666 },
    activo: true,
    capacidad: 100,
    consumo: 0,
    energia: 100,
    conexiones: [],
    metadata: {},
    ultimo_latido: Date.now(),
  }
}
