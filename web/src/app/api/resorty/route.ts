import { NextResponse } from 'next/server';
import { OFFICIAL_MINISTRIES } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    totalCount: OFFICIAL_MINISTRIES.length,
    timestamp: new Date().toISOString(),
    ministries: OFFICIAL_MINISTRIES,
  });
}
