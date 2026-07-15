import { DigitalTwin } from "../packages/digital-twin/src/digital-twin.ts"
import { createNode } from "../packages/digital-twin/src/node-model.ts"

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`) }
  catch (e) { console.log(`  ❌ ${name}: ${e}`) }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const twin = new DigitalTwin()
const casa = createNode("casa", "Mi Casa")
const tienda = createNode("tienda", "Bodega 23")

twin.register(casa)
twin.register(tienda)

test("register nodes", () => {
  assert(twin.get(casa.id)?.label === "Mi Casa", "casa not found")
  assert(twin.get(tienda.id)?.label === "Bodega 23", "tienda not found")
})

test("list by type", () => {
  assert(twin.list("casa").length === 1, "expected 1 casa")
  assert(twin.list("tienda").length === 1, "expected 1 tienda")
})

test("relate nodes", () => {
  twin.relate(casa.id, tienda.id, "datos", 0.8)
  const conns = twin.connections(casa.id)
  assert(conns.length === 1, `expected 1 connection got ${conns.length}`)
  assert(conns[0].tipo === "datos", "wrong type")
})

test("heartbeat", () => {
  const before = casa.ultimo_latido
  twin.heartbeat(casa.id)
  const after = twin.get(casa.id)!.ultimo_latido
  assert(after >= before, "heartbeat did not update")
})

test("stale detection", () => {
  const stale = twin.stale(0)
  assert(stale.length > 0, "expected stale nodes")
})

test("export", () => {
  const exp = twin.export()
  assert(exp.nodes.length === 2, `expected 2 nodes got ${exp.nodes.length}`)
  assert(exp.relations.length === 1, `expected 1 relation got ${exp.relations.length}`)
})

console.log("\nDigitalTwin tests complete")
