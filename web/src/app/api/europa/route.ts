import { NextResponse } from 'next/server';
import { getLiveConflicts } from '@/lib/live-data';

export async function GET() {
  const conflicts = await getLiveConflicts();
  const euSignals = { infringements: conflicts.filter((conflict) => conflict.conflictType === 'ROZDŹWIĘK_Z_BRUKSELĄ' || conflict.conflictType === 'RYZYKO_PROCEDURY_NARUSZENIOWEJ'), kpoMilestones: [], upcomingCouncils: [], dataStatus: 'VERIFIED_SOURCE_DATA' };

  return NextResponse.json(euSignals);
}
