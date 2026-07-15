import { AdaptiveRouter } from "../packages/adaptive-router/src/adaptive-router.ts"

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`) }
  catch (e) { console.log(`  ❌ ${name}: ${e}`) }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const router = new AdaptiveRouter()

test("scoreChannels returns sorted scores", () => {
  const scores = router.scoreChannels(10)
  assert(scores.length === 5, `expected 5 channels got ${scores.length}`)
  for (let i = 1; i < scores.length; i++) {
    assert(scores[i - 1].score >= scores[i].score, "not sorted descending")
  }
})

test("bestChannel returns a channel", () => {
  const ch = router.bestChannel(50)
  assert(typeof ch === "string", "not a string")
})

test("each channel has required fields", () => {
  const scores = router.scoreChannels(1)
  for (const s of scores) {
    assert(typeof s.score === "number", "score not number")
    assert(typeof s.latency === "number", "latency not number")
    assert(typeof s.throughput === "number", "throughput not number")
    assert(typeof s.cost === "number", "cost not number")
    assert(typeof s.available === "boolean", "available not boolean")
  }
})

console.log("\nAdaptiveRouter tests complete")
