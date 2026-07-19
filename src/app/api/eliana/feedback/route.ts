import { NextRequest, NextResponse } from 'next/server'
import { getFeedbackStats, getRecentFeedback } from '@/lib/eliana/feedback'

export async function GET() {
  const stats = getFeedbackStats()
  const recent = getRecentFeedback(10)
  return NextResponse.json({ stats, recent })
}
