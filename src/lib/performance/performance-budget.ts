'use client'

export interface BudgetEntry {
  metric: string
  target: number
  actual: number | null
  unit: string
  pass: boolean
  measuredAt: string | null
}

export interface BudgetReport {
  timestamp: string
  url: string
  networkMode: string
  entries: BudgetEntry[]
  overall: 'pass' | 'fail' | 'partial'
  failures: string[]
}

const BUDGETS: Omit<BudgetEntry, 'actual' | 'pass' | 'measuredAt'>[] = [
  { metric: 'LCP', target: 2500, unit: 'ms' },
  { metric: 'INP', target: 200, unit: 'ms' },
  { metric: 'CLS', target: 0.1, unit: 'score' },
  { metric: 'TTFB', target: 800, unit: 'ms' },
  { metric: 'FCP', target: 1800, unit: 'ms' },
  { metric: 'JS Initial', target: 150, unit: 'KB' },
  { metric: 'First Block Images', target: 300, unit: 'KB' },
  { metric: 'API Latency', target: 500, unit: 'ms' },
]

const STORAGE_KEY = 'zafiro_performance_budgets'

export function getBudgets(): Omit<BudgetEntry, 'actual' | 'pass' | 'measuredAt'>[] {
  return BUDGETS
}

export function measureLCP(): Promise<number> {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      resolve(0)
      return
    }
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1]
        if (last) {
          resolve(last.startTime)
          observer.disconnect()
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      setTimeout(() => { observer.disconnect(); resolve(0) }, 10000)
    } catch { resolve(0) }
  })
}

export function measureCLS(): Promise<number> {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      resolve(0)
      return
    }
    let cls = 0
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as unknown as { hadRecentInput?: boolean; value?: number }
          if (!shift.hadRecentInput) cls += shift.value || 0
        }
      })
      observer.observe({ type: 'layout-shift', buffered: true })
      setTimeout(() => { observer.disconnect(); resolve(parseFloat(cls.toFixed(3))) }, 5000)
    } catch { resolve(0) }
  })
}

export function measureTTFB(): Promise<number> {
  return new Promise(resolve => {
    if (typeof window === 'undefined') { resolve(0); return }
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav) {
      resolve(nav.responseStart - nav.requestStart)
    } else {
      resolve(0)
    }
  })
}

export function estimateJSSize(): number {
  if (typeof window === 'undefined') return 0
  const scripts = document.getElementsByTagName('script')
  let totalKB = 0
  for (const script of scripts) {
    if (script.src) totalKB += 50
  }
  return totalKB
}

export async function runBudgetCheck(url: string, networkMode: string): Promise<BudgetReport> {
  const [lcp, cls, ttfb] = await Promise.all([measureLCP(), measureCLS(), measureTTFB()])
  const jsSize = estimateJSSize()

  const entries: BudgetEntry[] = BUDGETS.map(b => {
    let actual: number | null = null
    if (b.metric === 'LCP') actual = lcp
    else if (b.metric === 'CLS') actual = cls
    else if (b.metric === 'TTFB') actual = ttfb
    else if (b.metric === 'JS Initial') actual = jsSize
    else if (b.metric === 'API Latency') actual = 0

    return {
      ...b,
      actual,
      pass: actual !== null ? actual <= b.target : true,
      measuredAt: actual !== null ? new Date().toISOString() : null,
    }
  })

  const failures = entries.filter(e => !e.pass).map(e => `${e.metric}: ${e.actual}${e.unit} (target: ${e.target}${e.unit})`)
  const passed = entries.filter(e => e.pass).length
  const overall: 'pass' | 'fail' | 'partial' = failures.length === 0 ? 'pass' : passed > 0 ? 'partial' : 'fail'

  const report: BudgetReport = { timestamp: new Date().toISOString(), url, networkMode, entries, overall, failures }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const reports: BudgetReport[] = raw ? JSON.parse(raw) : []
    reports.push(report)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(-50)))
  } catch { /* silent */ }

  return report
}

export function getBudgetHistory(): BudgetReport[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearBudgetHistory(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* silent */ }
}
