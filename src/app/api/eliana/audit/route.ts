import { NextResponse } from 'next/server'
import { getAllActions, getAgents } from '@/lib/eliana/core/agent-registry'
import { getAllRules } from '@/lib/eliana/core/rules-engine'
import { getSyncHistory } from '@/lib/eliana/core/sync-protocol'

export async function GET() {
  return NextResponse.json({
    agents: getAgents(),
    rules: getAllRules().map(r => ({ id: r.id, version: r.version, title: r.title, status: r.status })),
    actions: getAllActions(20),
    sync: getSyncHistory(10),
  })
}
