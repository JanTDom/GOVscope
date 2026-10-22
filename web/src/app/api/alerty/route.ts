import { NextRequest, NextResponse } from 'next/server';
import { getLiveConflicts } from '@/lib/live-data';

interface AlertItem {
  id: string;
  conflictId: string;
  priority: 'P1' | 'P2' | 'P3';
  topic: string;
  title: string;
  targetAudience: string;
  status: 'QUEUED' | 'DELIVERED' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

export async function GET(request: NextRequest) {
  const conflicts = await getLiveConflicts();
  const alerts: AlertItem[] = conflicts.map((c) => ({
    id: `alert-${c.id}`,
    conflictId: c.id,
    priority: c.severity === 'P1_CRITICAL' ? 'P1' : c.severity === 'P2_HIGH' ? 'P2' : 'P3',
    topic: c.topic,
    title: c.title,
    targetAudience: c.severity === 'P1_CRITICAL' ? 'KPRM_PREMIER' : 'KPRM_KOMUNIKACJA',
    status: c.resolutionStatus === 'RESOLVED' ? 'RESOLVED' : 'DELIVERED',
    createdAt: c.detectedAt,
  }));
  const { searchParams } = new URL(request.url);
  const priority = searchParams.get('priority');

  const filtered = priority
    ? alerts.filter((a) => a.priority === priority)
    : alerts;

  return NextResponse.json({
    total: filtered.length,
    p1Count: alerts.filter((a) => a.priority === 'P1').length,
    alerts: filtered,
    dataStatus: 'VERIFIED_SOURCE_DATA',
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    return NextResponse.json({ error: 'Zmiana statusu wymaga zapisu przez worker serwerowy' }, { status: 403 });
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe żądanie' }, { status: 400 });
  }
}
