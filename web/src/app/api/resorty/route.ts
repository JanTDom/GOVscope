import { NextResponse } from 'next/server';
import { getLiveMinistries } from '@/lib/live-data';

export async function GET() {
  const ministries = await getLiveMinistries();
  return NextResponse.json({
    totalCount: ministries.length,
    timestamp: new Date().toISOString(),
    ministries,
    dataStatus: 'VERIFIED_SOURCE_DATA',
  });
}
