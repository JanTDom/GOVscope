import { NextResponse } from 'next/server';
import { INITIAL_CONFLICTS, INITIAL_METRICS } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    metrics: INITIAL_METRICS,
    conflicts: INITIAL_CONFLICTS,
  });
}
