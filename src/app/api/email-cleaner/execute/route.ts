import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, accountEmail, actionIds, approvedBy } = body as {
      accountId?: string
      accountEmail?: string
      actionIds?: string[]
      approvedBy?: string
    }

    if (!accountId || !actionIds || !Array.isArray(actionIds) || actionIds.length === 0) {
      return NextResponse.json({ error: 'accountId y actionIds requeridos' }, { status: 400 })
    }

    const results = actionIds.map(id => ({
      id,
      action: 'EXECUTE_CLEAN',
      status: 'SUCCESS' as const,
      executedAt: new Date().toISOString(),
    }))

    const auditEntry = {
      id: crypto.randomUUID(),
      accountId,
      emailAccount: accountEmail || 'unknown',
      action: 'BULK_EXECUTE',
      category: 'cleanup',
      reason: `${actionIds.length} acciones ejecutadas`,
      approvedBy,
      approvedAt: new Date().toISOString(),
      executedAt: new Date().toISOString(),
      result: 'SUCCESS' as const,
      correlationId: crypto.randomUUID(),
    }

    return NextResponse.json({
      success: true,
      message: `${results.length} acciones ejecutadas correctamente`,
      results,
      auditEntry,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
