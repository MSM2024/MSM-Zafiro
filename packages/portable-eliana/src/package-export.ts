export type PortablePackage = {
  version: "1.0"
  metadata: {
    created: string
    author: string
    origin: string
    app: "ZAFIRO"
    module: "ELIANA"
  }
  content: {
    conversaciones: PortableConversacion[]
    configuracion: Record<string, unknown>
    guardianes: PortableGuardianState[]
    firma: string
  }
}

type PortableConversacion = {
  id: string
  fecha: string
  mensajes: { rol: "user" | "assistant"; texto: string; timestamp: number }[]
}

type PortableGuardianState = {
  id: number
  activo: boolean
  ultima_accion: string
}

export function createPortablePackage(
  conversaciones: PortableConversacion[],
  configuracion: Record<string, unknown>,
  guardianes: PortableGuardianState[]
): PortablePackage {
  const raw: Omit<PortablePackage["content"], "firma"> = {
    conversaciones,
    configuracion,
    guardianes,
  }
  return {
    version: "1.0",
    metadata: {
      created: new Date().toISOString(),
      author: "ELIANA",
      origin: typeof window !== "undefined" ? window.location.origin : "unknown",
      app: "ZAFIRO",
      module: "ELIANA",
    },
    content: {
      ...raw,
      firma: signPackage(raw),
    },
  }
}

function signPackage(data: unknown): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return `zafiro-${Math.abs(hash).toString(16)}`
}

export function verifyPackage(pkg: PortablePackage): boolean {
  const { firma, ...rest } = pkg.content
  const expected = signPackage(rest)
  return firma === expected
}

export function exportToJson(pkg: PortablePackage): string {
  return JSON.stringify(pkg, null, 2)
}

export function downloadPackage(pkg: PortablePackage, filename = "eliana-package.json"): void {
  const blob = new Blob([exportToJson(pkg)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
