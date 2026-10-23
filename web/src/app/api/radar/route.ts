import { NextResponse } from 'next/server';
import { getLiveConflicts, getLiveMetrics } from '@/lib/live-data';

export async function GET() {
  const [metrics, conflicts] = await Promise.all([getLiveMetrics(), getLiveConflicts()]);
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    metrics,
    conflicts,
    dataStatus: 'VERIFIED_SOURCE_DATA',
  });
}
