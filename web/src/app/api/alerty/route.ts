import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CONFLICTS } from '@/lib/store';

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

// In-memory alert registry
let ALERTS_STORE: AlertItem[] = INITIAL_CONFLICTS.map((c, idx) => ({
  id: `alt-2026-00${idx + 1}`,
  conflictId: c.id,
  priority: c.severity === 'P1_CRITICAL' ? 'P1' : 'P2',
  topic: c.topic,
  title: c.title,
  targetAudience: c.severity === 'P1_CRITICAL' ? 'KPRM_PREMIER' : 'KPRM_KOMUNIKACJA',
  status: 'DELIVERED',
  createdAt: c.detectedAt,
}));

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priority = searchParams.get('priority');

  const filtered = priority
    ? ALERTS_STORE.filter((a) => a.priority === priority)
    : ALERTS_STORE;

  return NextResponse.json({
    total: filtered.length,
    p1Count: ALERTS_STORE.filter((a) => a.priority === 'P1').length,
    alerts: filtered,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const alertIndex = ALERTS_STORE.findIndex((a) => a.id === id);
    if (alertIndex === -1) {
      return NextResponse.json({ error: 'Nie znaleziono alertu' }, { status: 404 });
    }

    ALERTS_STORE[alertIndex] = {
      ...ALERTS_STORE[alertIndex],
      status: status || ALERTS_STORE[alertIndex].status,
    };

    return NextResponse.json({
      success: true,
      alert: ALERTS_STORE[alertIndex],
    });
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe żądanie' }, { status: 400 });
  }
}
