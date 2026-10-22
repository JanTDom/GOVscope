import type { MinistryItem, NarrativeConflictItem, SystemMetricSummary } from '@/types';

type JsonRecord = Record<string, unknown>;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function readTable<T extends JsonRecord>(table: string, query: string): Promise<T[]> {
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  });
  if (!response.ok) return [];
  const payload: unknown = await response.json();
  return Array.isArray(payload) ? payload as T[] : [];
}

function statementFromRow(row: JsonRecord): NarrativeConflictItem['statements'][number] {
  return {
    id: String(row.id),
    officialName: String(row.official_name ?? 'Nieustalony urzędnik'),
    roleTitle: String(row.role_title ?? ''),
    ministryCode: String(row.ministry_code ?? ''),
    coalitionParty: String(row.coalition_party ?? 'NON_PARTISAN') as NarrativeConflictItem['statements'][number]['coalitionParty'],
    quote: String(row.quote ?? row.content ?? ''),
    source: String(row.source ?? row.source_url ?? 'Źródło oficjalne'),
    publishedAt: String(row.published_at ?? ''),
  };
}

export async function getLiveConflicts(): Promise<NarrativeConflictItem[]> {
  const rows = await readTable<JsonRecord>(
    'narrative_conflicts',
    'select=*&verified=eq.true&order=created_at.desc&limit=100',
  );
  return rows.map((row) => ({
    id: String(row.id),
    conflictType: String(row.conflict_type) as NarrativeConflictItem['conflictType'],
    severity: String(row.severity) as NarrativeConflictItem['severity'],
    title: String(row.title),
    summary: String(row.summary),
    topic: String(row.topic ?? row.conflict_type),
    detectedAt: String(row.created_at),
    resolutionStatus: String(row.resolution_status ?? 'DETECTED') as NarrativeConflictItem['resolutionStatus'],
    statements: Array.isArray(row.statements_involved) ? row.statements_involved.map((item) => statementFromRow(item as JsonRecord)) : [],
    recommendedAction: String(row.recommended_action ?? 'Wymaga weryfikacji przez dyżur KPRM.'),
    ministriesInvolved: Array.isArray(row.ministries_involved) ? row.ministries_involved.map(String) : [],
    euImpact: row.gemini_analysis && typeof row.gemini_analysis === 'object' ? row.gemini_analysis as NarrativeConflictItem['euImpact'] : undefined,
  }));
}

export async function getLiveMetrics(): Promise<SystemMetricSummary> {
  const [statements, conflicts, alerts, ministries, officials] = await Promise.all([
    readTable<JsonRecord>('official_statements', 'select=id,created_at&verified=eq.true&source_url=not.is.null'),
    readTable<JsonRecord>('narrative_conflicts', 'select=id,severity&verified=eq.true'),
    readTable<JsonRecord>('alerts', 'select=id,priority&verified=eq.true&status=neq.RESOLVED'),
    readTable<JsonRecord>('ministries_and_bodies', 'select=id'),
    readTable<JsonRecord>('officials', 'select=id&is_active=eq.true'),
  ]);
  const day = new Date().toISOString().slice(0, 10);
  const todayStatements = statements.filter((row) => String(row.created_at ?? '').startsWith(day)).length;
  return {
    overallCohesionIndex: conflicts.length === 0 ? 100 : Math.max(0, 100 - conflicts.length * 2),
    activeP1Alerts: alerts.filter((row) => row.priority === 'P1').length,
    activeP2Alerts: alerts.filter((row) => row.priority === 'P2').length,
    totalMonitoredStatementsToday: todayStatements,
    monitoredMinistriesCount: ministries.length,
    monitoredOfficialsCount: officials.length,
  };
}

export async function getLiveMinistries(): Promise<MinistryItem[]> {
  const [rows, officials, conflicts, statements] = await Promise.all([
    readTable<JsonRecord>('ministries_and_bodies', 'select=*&is_active=eq.true&order=short_name.asc'),
    readTable<JsonRecord>('officials', 'select=id,ministry_id,full_name,role_title,coalition_party,responsibilities&is_active=eq.true&order=full_name.asc'),
    readTable<JsonRecord>('narrative_conflicts', 'select=ministries_involved,severity&verified=eq.true&resolution_status=neq.RESOLVED'),
    readTable<JsonRecord>('official_statements', 'select=ministry_id,published_at&verified=eq.true&source_url=not.is.null&order=published_at.desc'),
  ]);
  return rows.map((row) => ({
    id: String(row.id),
    code: String(row.code),
    namePl: String(row.name_pl),
    shortName: String(row.short_name),
    coalitionParty: String(row.coalition_party ?? 'NON_PARTISAN') as MinistryItem['coalitionParty'],
    cohesionScore: 100,
    activeAlertsCount: conflicts.filter((conflict) => Array.isArray(conflict.ministries_involved) && conflict.ministries_involved.includes(row.id)).length,
    lastStatementDate: String(statements.find((statement) => statement.ministry_id === row.id)?.published_at ?? ''),
    leadership: officials.filter((official) => official.ministry_id === row.id).map((official) => ({
      name: String(official.full_name),
      role: String(official.role_title),
      party: String(official.coalition_party ?? 'NON_PARTISAN') as MinistryItem['leadership'][number]['party'],
      responsibilities: Array.isArray(official.responsibilities) ? official.responsibilities.map(String) : [],
    })),
  }));
}
