import { NextResponse } from 'next/server';
import { getLiveConflicts } from '@/lib/live-data';

export async function GET() {
  const conflicts = await getLiveConflicts();
  const clashConflicts = conflicts.filter(
    (c) => c.statements && c.statements.length >= 2
  );
  return NextResponse.json({
    clashCount: clashConflicts.length,
    timestamp: new Date().toISOString(),
    clashes: clashConflicts,
    dataStatus: 'VERIFIED_SOURCE_DATA',
  });
}
