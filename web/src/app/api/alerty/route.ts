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
  const { searchParams } = new URL(request.url);
  const ministry = searchParams.get('ministry')?.trim().toUpperCase();
  let ministryId = '';
  if (ministry) {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (baseUrl && anonKey) {
      const response = await fetch(`${baseUrl}/rest/v1/ministries_and_bodies?select=id&code=eq.${encodeURIComponent(ministry)}&limit=1`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        cache: 'no-store',
      });
      if (response.ok) {
        const rows = await response.json() as Array<{ id?: string }>;
        ministryId = String(rows[0]?.id ?? '');
      }
    }
  }
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
  const priority = searchParams.get('priority');

  const filtered = alerts.filter((alert) => {
    const conflict = conflicts.find((item) => item.id === alert.conflictId);
    const matchesPriority = !priority || alert.priority === priority;
    const matchesMinistry = !ministry || Boolean(ministryId && conflict?.ministriesInvolved?.includes(ministryId));
    return matchesPriority && matchesMinistry;
  });

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
