import {
  createPortablePackage,
  verifyPackage,
} from "../packages/portable-eliana/src/package-export.ts"

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`) }
  catch (e) { console.log(`  ❌ ${name}: ${e}`) }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const pkg = createPortablePackage(
  [{ id: "c1", fecha: "2026-01-01", mensajes: [{ rol: "user", texto: "hola", timestamp: 100 }] }],
  { idioma: "es" },
  [{ id: 1, activo: true, ultima_accion: "ok" }]
)

test("creates package with version", () => assert(pkg.version === "1.0", "bad version"))
test("has metadata", () => assert(pkg.metadata.app === "ZAFIRO", "bad app"))
test("content has firma", () => assert(typeof pkg.content.firma === "string", "no firma"))
test("verifyPackage returns true", () => assert(verifyPackage(pkg), "verify failed"))
test("verifyPackage returns false for tampered data", () => {
  const tampered = { ...pkg, content: { ...pkg.content, firma: "bad" } }
  assert(!verifyPackage(tampered), "tampered should fail")
})

console.log("\nPortable ELIANA tests complete")
