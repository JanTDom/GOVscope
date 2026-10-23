import type { GovernmentActivity, MinisterLeadership, MinistryItem, NarrativeConflictItem, RoleCategory, SystemMetricSummary } from '@/types';

type JsonRecord = Record<string, unknown>;

const ROLE_CATEGORIES: readonly RoleCategory[] = [
  'PREMIER',
  'WICEPREMIER',
  'MINISTER',
  'WICEMINISTER',
  'PELNOMOCNIK',
  'RZECZNIK',
  'DYREKTOR_GENERALNY',
];

const MINISTER_WITHOUT_RESORT_CODES = new Set(['M_UE', 'M_ROWNOSC', 'M_SENIOR', 'M_SPOLECZENSTWO']);

function roleCategoryFromRow(row: JsonRecord): RoleCategory {
  const category = String(row.role_category ?? '');
  if (ROLE_CATEGORIES.includes(category as RoleCategory)) return category as RoleCategory;

  const title = String(row.role_title ?? '').toLocaleLowerCase('pl-PL');
  if (title.includes('podsekretarz stanu')) return 'WICEMINISTER';
  if (title.includes('sekretarz stanu')) return 'WICEMINISTER';
  if (title.includes('wicepremier')) return 'WICEPREMIER';
  if (title.includes('minister')) return 'MINISTER';
  if (title.includes('dyrektor general')) return 'DYREKTOR_GENERALNY';
  return 'RZECZNIK';
}

export function leadershipRoleOrder(roleCategory: RoleCategory, roleTitle: string): number {
  const title = roleTitle.toLocaleLowerCase('pl-PL');

  // The title is authoritative for the secretary/undersecretary split. The
  // database currently uses WICEMINISTER for both, so checking the category
  // alone cannot produce the required order.
  if (roleCategory === 'PREMIER' || /\bprezes rady ministrów\b/.test(title)) return 0;
  if (title.includes('podsekretarz stanu')) return 30;
  if (title.includes('sekretarz stanu')) return 20;
  if (title.includes('szef kancelarii prezesa rady ministrów')) return 5;
  if (roleCategory === 'WICEPREMIER' || title.includes('wiceprezes rady ministrów')) return 10;
  if (roleCategory === 'MINISTER' || title.includes('minister')) return 10;
  if (roleCategory === 'PELNOMOCNIK') return 40;
  if (roleCategory === 'RZECZNIK' || title.includes('rzecznik')) return 50;
  if (roleCategory === 'DYREKTOR_GENERALNY' || title.includes('dyrektor general')) return 60;
  return 70;
}

export function compareLeadership(left: MinisterLeadership, right: MinisterLeadership): number {
  const orderDifference = leadershipRoleOrder(left.roleCategory, left.role) - leadershipRoleOrder(right.roleCategory, right.role);
  return orderDifference || left.name.localeCompare(right.name, 'pl');
}

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
    readTable<JsonRecord>('ministries_and_bodies', 'select=id&is_active=eq.true&or=(body_type.eq.MINISTRY,code.eq.KPRM)'),
    readTable<JsonRecord>('officials', 'select=id&is_active=eq.true'),
  ]);
  const day = new Date().toISOString().slice(0, 10);
  const todayStatements = statements.filter((row) => String(row.created_at ?? '').startsWith(day)).length;
  return {
    overallCohesionIndex: conflicts.length === 0 && statements.length === 0
      ? null
      : Math.max(0, 100 - conflicts.length * 2),
    activeP1Alerts: alerts.filter((row) => row.priority === 'P1').length,
    activeP2Alerts: alerts.filter((row) => row.priority === 'P2').length,
    totalMonitoredStatementsToday: todayStatements,
    monitoredMinistriesCount: ministries.length,
    monitoredOfficialsCount: officials.length,
  };
}

export async function getLiveMinistries(): Promise<MinistryItem[]> {
  const [rows, officials, conflicts, statements] = await Promise.all([
    readTable<JsonRecord>('ministries_and_bodies', 'select=*&is_active=eq.true&or=(body_type.eq.MINISTRY,code.eq.KPRM)&order=short_name.asc'),
    readTable<JsonRecord>('officials', 'select=id,ministry_id,full_name,role_title,role_category,coalition_party,responsibilities&is_active=eq.true&order=full_name.asc'),
    readTable<JsonRecord>('narrative_conflicts', 'select=ministries_involved,severity&verified=eq.true&resolution_status=neq.RESOLVED'),
    readTable<JsonRecord>('official_statements', 'select=ministry_id,published_at&verified=eq.true&source_url=not.is.null&order=published_at.desc'),
  ]);
  return rows
    .filter((row) => !MINISTER_WITHOUT_RESORT_CODES.has(String(row.code)))
    .map((row) => ({
      id: String(row.id),
      code: String(row.code),
      namePl: String(row.name_pl),
      shortName: String(row.short_name),
      coalitionParty: String(row.coalition_party ?? 'NON_PARTISAN') as MinistryItem['coalitionParty'],
      cohesionScore: conflicts.some((conflict) => Array.isArray(conflict.ministries_involved) && conflict.ministries_involved.includes(String(row.id)))
        ? 0
        : statements.some((statement) => statement.ministry_id === row.id)
          ? 100
          : null,
      activeAlertsCount: conflicts.filter((conflict) => Array.isArray(conflict.ministries_involved) && conflict.ministries_involved.includes(row.id)).length,
      lastStatementDate: String(statements.find((statement) => statement.ministry_id === row.id)?.published_at ?? ''),
      leadership: officials
        .filter((official) => official.ministry_id === row.id)
        .map((official) => ({
          name: String(official.full_name),
          role: String(official.role_title),
          roleCategory: roleCategoryFromRow(official),
          party: String(official.coalition_party ?? 'NON_PARTISAN') as MinistryItem['leadership'][number]['party'],
          responsibilities: Array.isArray(official.responsibilities) ? official.responsibilities.map(String) : [],
        }))
        .sort(compareLeadership),
    }));
}

function activitySummary(value: unknown, fallback: unknown): string {
  const text = String(value ?? fallback ?? '').replace(/\s+/g, ' ').trim();
  return text.length > 280 ? `${text.slice(0, 277)}...` : text;
}

function activityKind(sourceType: string, title: string): GovernmentActivity['kind'] {
  const normalizedTitle = title.toLocaleLowerCase('pl-PL');
  if (sourceType === 'PRESS_CONFERENCE' || normalizedTitle.includes('konferenc')) return 'PRESS_CONFERENCE';
  if (sourceType === 'MEDIA_INTERVIEW') return 'MEDIA_COVERAGE';
  return 'OFFICIAL_STATEMENT';
}

export async function getLiveActivities(): Promise<GovernmentActivity[]> {
  const [ministries, officials, statements, media, planned] = await Promise.all([
    readTable<JsonRecord>('ministries_and_bodies', 'select=id,code,name_pl,short_name&is_active=eq.true'),
    readTable<JsonRecord>('officials', 'select=id,full_name&is_active=eq.true'),
    readTable<JsonRecord>(
      'official_statements',
      'select=id,title,summary,content,published_at,source_url,source_type,ministry_id,official_id,raw_metadata&verified=eq.true&source_url=not.is.null&order=published_at.desc&limit=40',
    ),
    readTable<JsonRecord>(
      'media_coverage',
      'select=id,article_title,content,published_at,source_url,outlet_name,sentiment&verified=eq.true&source_url=not.is.null&order=published_at.desc&limit=40',
    ),
    readTable<JsonRecord>(
      'government_activities',
      'select=id,title,summary,starts_at,source_url,source_name,ministry_id,official_id,status,location&verified=eq.true&source_url=not.is.null&status=neq.CANCELLED&order=starts_at.asc&limit=40',
    ),
  ]);

  const ministryById = new Map(ministries.map((row) => [String(row.id), row]));
  const officialById = new Map(officials.map((row) => [String(row.id), String(row.full_name)]));
  const statementActivities = statements.map((row): GovernmentActivity => {
    const ministry = ministryById.get(String(row.ministry_id));
    const title = String(row.title ?? 'Komunikat urzędowy');
    return {
      id: `statement-${String(row.id)}`,
      kind: activityKind(String(row.source_type ?? 'GOV_PL'), title),
      title,
      summary: activitySummary(row.summary, row.content),
      publishedAt: String(row.published_at ?? ''),
      sourceUrl: String(row.source_url),
      sourceName: String((row.raw_metadata as JsonRecord | undefined)?.source_name ?? 'gov.pl'),
      ministryCode: ministry ? String(ministry.code) : undefined,
      ministryName: ministry ? String(ministry.name_pl) : undefined,
      officialName: officialById.get(String(row.official_id)),
    };
  });
  const mediaActivities = media.map((row): GovernmentActivity => ({
    id: `media-${String(row.id)}`,
    kind: 'MEDIA_COVERAGE',
    title: String(row.article_title ?? 'Materiał medialny'),
    summary: activitySummary(row.content, row.article_title),
    publishedAt: String(row.published_at ?? ''),
    sourceUrl: String(row.source_url),
    sourceName: String(row.outlet_name ?? 'Media'),
  }));
  const plannedActivities = planned.map((row): GovernmentActivity => {
    const ministry = ministryById.get(String(row.ministry_id));
    return {
      id: `planned-${String(row.id)}`,
      kind: 'PLANNED_ACTIVITY',
      title: String(row.title),
      summary: activitySummary(row.summary, row.title),
      publishedAt: String(row.starts_at ?? ''),
      sourceUrl: String(row.source_url),
      sourceName: String(row.source_name ?? 'Źródło urzędowe'),
      ministryCode: ministry ? String(ministry.code) : undefined,
      ministryName: ministry ? String(ministry.name_pl) : undefined,
      officialName: officialById.get(String(row.official_id)),
      status: String(row.status ?? 'PLANNED') as GovernmentActivity['status'],
      location: row.location ? String(row.location) : undefined,
    };
  });

  return [...plannedActivities, ...statementActivities, ...mediaActivities]
    .filter((activity) => activity.publishedAt)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .slice(0, 60);
}
