import { NextResponse } from 'next/server';
import { getLiveActivities } from '@/lib/live-data';

export async function GET() {
  const activities = await getLiveActivities();
  return NextResponse.json({
    activities,
    totalCount: activities.length,
    timestamp: new Date().toISOString(),
    dataStatus: 'VERIFIED_SOURCE_DATA',
  });
}
