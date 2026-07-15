import { SyncQueue } from "../packages/sync/src/sync-queue.ts"

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`) }
  catch (e) { console.log(`  ❌ ${name}: ${e}`) }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const queue = new SyncQueue()
const id = queue.enqueue({ type: "create", table: "test", payload: { foo: "bar" } })

test("enqueue returns id", () => assert(typeof id === "string" && id.length > 0, "no id"))
test("dequeue returns operation", () => {
  const op = queue.dequeue()
  assert(op?.id === id, "wrong id")
  assert(op?.status === "processing", "not processing")
})
test("confirm marks as confirmed", () => {
  queue.confirm(id)
  const all = queue.all()
  assert(all.find((o) => o.id === id)?.status === "confirmed", "not confirmed")
})
test("retry increases backoff", () => {
  const q2 = new SyncQueue()
  const id2 = q2.enqueue({ type: "update", table: "t", payload: {} })
  q2.dequeue()
  q2.retry(id2)
  const op = q2.all().find((o) => o.id === id2)
  assert(op?.retries === 1, `retries=${op?.retries}`)
  assert(op?.backoffMs === 2000, `backoff=${op?.backoffMs}`)
})
test("retry fails after maxRetries", () => {
  const q3 = new SyncQueue()
  const id3 = q3.enqueue({ type: "delete", table: "t", payload: {} })
  for (let i = 0; i < 6; i++) { q3.dequeue(); q3.retry(id3) }
  const op = q3.all().find((o) => o.id === id3)
  assert(op?.status === "failed", `status=${op?.status}`)
})

console.log("\nSyncQueue tests complete")
