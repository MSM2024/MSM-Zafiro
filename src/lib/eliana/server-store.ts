// Almacenamiento en memoria para entorno servidor (reemplazo de localStorage)
// Frecuencia 369

const store = new Map<string, string>()

export function serverGetItem(key: string): string | null {
  return store.get(key) || null
}

export function serverSetItem(key: string, value: string): void {
  store.set(key, value)
  if (store.size > 1000) {
    const firstKey = store.keys().next().value
    if (firstKey) store.delete(firstKey)
  }
}

export function serverRemoveItem(key: string): void {
  store.delete(key)
}

export function serverGetJSON<T>(key: string): T {
  try {
    const val = store.get(key)
    return val ? JSON.parse(val) : ([] as unknown as T)
  } catch {
    return [] as unknown as T
  }
}

export function serverSetJSON(key: string, value: unknown): void {
  store.set(key, JSON.stringify(value))
}
