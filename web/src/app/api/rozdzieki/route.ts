import { NextResponse } from 'next/server';
import { INITIAL_CONFLICTS } from '@/lib/store';

export async function GET() {
  const clashConflicts = INITIAL_CONFLICTS.filter(
    (c) => c.statements && c.statements.length >= 2
  );
  return NextResponse.json({
    clashCount: clashConflicts.length,
    timestamp: new Date().toISOString(),
    clashes: clashConflicts,
  });
}
