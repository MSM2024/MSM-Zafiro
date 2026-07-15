import { type DigitalNode, type NodeRelation } from "./node-model"

export class DigitalTwin {
  private nodes: Map<string, DigitalNode> = new Map()
  private relations: Map<string, NodeRelation> = new Map()

  register(node: DigitalNode): void {
    this.nodes.set(node.id, node)
  }

  unregister(id: string): void {
    this.nodes.delete(id)
    for (const [key, rel] of this.relations) {
      if (rel.from === id || rel.to === id) this.relations.delete(key)
    }
  }

  get(id: string): DigitalNode | undefined {
    return this.nodes.get(id)
  }

  list(type?: string): DigitalNode[] {
    return Array.from(this.nodes.values()).filter((n) => !type || n.type === type)
  }

  relate(from: string, to: string, tipo: NodeRelation["tipo"], peso: number): void {
    const key = `${from}->${to}`
    this.relations.set(key, { from, to, tipo, peso, activo: true })
    const fn = this.nodes.get(from)
    const tn = this.nodes.get(to)
    if (fn && !fn.conexiones.includes(to)) fn.conexiones.push(to)
    if (tn && !tn.conexiones.includes(from)) tn.conexiones.push(from)
  }

  connections(id: string): NodeRelation[] {
    return Array.from(this.relations.values()).filter(
      (r) => (r.from === id || r.to === id) && r.activo
    )
  }

  heartbeat(id: string): void {
    const node = this.nodes.get(id)
    if (node) node.ultimo_latido = Date.now()
  }

  stale(thresholdMs = 300000): DigitalNode[] {
    const now = Date.now()
    return Array.from(this.nodes.values()).filter((n) => now - n.ultimo_latido > thresholdMs)
  }

  export(): { nodes: DigitalNode[]; relations: NodeRelation[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      relations: Array.from(this.relations.values()),
    }
  }
}
