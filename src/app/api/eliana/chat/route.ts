import { NextRequest, NextResponse } from 'next/server'
import { processQuery, getCoreStatus } from '@/lib/eliana/core/eliana-core'
import { executeSyncFlow } from '@/lib/eliana/core/sync-protocol'
import { formatRulesForPrompt, type RuleSource } from '@/lib/eliana/core/rules-engine'
import type { AgentId } from '@/lib/eliana/core/agent-registry'
import { buildOwnerSystemPrompt, ELIANA_VERSION, ELIANA_LAST_UPDATED } from '@/lib/eliana/system-prompt'
import { formatLegalForPrompt } from '@/lib/legal/terms-engine'
import { filterResponse } from '@/lib/eliana/response-filter'
import { callAI } from '@/lib/ai/providers'
import { getAvailableProviders } from '@/lib/eliana/core/fallback-manager'
import { authenticateRequest } from '@/lib/security-middleware'
import { isFeatureEnabled } from '@/lib/feature-flags'

const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 30
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1'
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }
  if (entry.count >= RATE_LIMIT_MAX) return { allowed: false, remaining: 0 }
  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count }
}

export async function POST(request: NextRequest) {
  try {
    const key = getRateLimitKey(request)
    const { allowed } = checkRateLimit(key)
    if (!allowed) {
      return NextResponse.json({ text: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' }, { status: 429 })
    }

    const body = await request.json()
    const { message, history, session } = body as {
      message?: string
      history?: Array<{ role: string; text: string }>
      session?: { email?: string }
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ text: 'El campo message es obligatorio.' }, { status: 400 })
    }

    // ─── ELIANA_CORE: Procesar con el nuevo Response Router ───
    const coreResult = processQuery(message, 'eliana', session)
    const correlationId = coreResult.correlationId

    // ─── AI Synthesis (async, no bloquea la respuesta inmediata) ───
    if (coreResult.provider === 'knowledge' || coreResult.provider === 'local') {
      const availableProviders = getAvailableProviders()
      if (availableProviders.length > 0) {
        const isOwner = !!session?.email && session.email === 'com8msm@gmail.com'
        const rulesContext = formatRulesForPrompt('eliana')
        const legalContext = formatLegalForPrompt()
        const combinedContext = [rulesContext, legalContext].filter(Boolean).join('\n\n')
        const systemPrompt = buildOwnerSystemPrompt(isOwner, combinedContext)
        const knowledgeContext = coreResult.knowledgeUsed && coreResult.text
          ? `Información de ZAFIRO:\n${coreResult.text.slice(0, 1500)}`
          : ''

        callAI(message, history || [], `${systemPrompt}\n\n${knowledgeContext}\n\nResponde directamente al usuario en lenguaje natural. No menciones tu contexto interno. Usa español.`).then(result => {
          if (result.text) {
            const filtered = filterResponse(result.text)
            if (!filtered.blocked && filtered.filteredText) {
              const traces = JSON.parse(localStorage?.getItem?.('zafiro_eliana_traces') || '[]')
              traces.push({ step: 'ai_synthesis', result: 'ok', correlationId, timestamp: new Date().toISOString() })
              localStorage?.setItem?.('zafiro_eliana_traces', JSON.stringify(traces.slice(-500)))
            }
          }
        }).catch(() => {})
      }
    }

    return NextResponse.json({
      text: coreResult.text,
      intent: coreResult.intent,
      provider: coreResult.provider,
      model: coreResult.model,
      sources: coreResult.sources,
      confidence: coreResult.confidence,
      knowledgeUsed: coreResult.knowledgeUsed,
      correlationId,
      version: ELIANA_VERSION,
    })
  } catch {
    return NextResponse.json({ text: 'Error interno del servidor.' }, { status: 500 })
  }
}

// GET: Health check + core status + version info
export async function GET() {
  const core = getCoreStatus()
  return NextResponse.json({
    status: 'ok',
    version: ELIANA_VERSION,
    lastUpdated: ELIANA_LAST_UPDATED,
    eliana: 'ACTIVA',
    uptime: core.uptime,
    core,
  })
}

// PUT: Sync flow (owner only — receives instructions from Don Miguel via code)
export async function PUT(request: NextRequest) {
  if (isFeatureEnabled('SECURITY_MIDDLEWARE_ENABLED')) {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
    }
  }

  try {
    const body = await request.json()
    const { instruction, source, agentId } = body as {
      instruction?: string
      source?: string
      agentId?: string
    }

    if (!instruction) {
      return NextResponse.json({ success: false, error: 'instruction es obligatorio' }, { status: 400 })
    }

    const result = executeSyncFlow(
      instruction,
      (source || 'don_miguel') as RuleSource,
      (agentId || 'opencode') as 'opencode' | 'eliana' | 'codex'
    )

    return NextResponse.json({ success: result.success, rule: result.rule, events: result.events })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}
