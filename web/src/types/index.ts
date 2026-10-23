export type CoalitionParty = 'KO' | 'PSL' | 'POLSKA_2050' | 'NOWA_LEWICA' | 'NON_PARTISAN';

export type RoleCategory =
  | 'PREMIER'
  | 'WICEPREMIER'
  | 'MINISTER'
  | 'WICEMINISTER'
  | 'PELNOMOCNIK'
  | 'RZECZNIK'
  | 'DYREKTOR_GENERALNY';

export type ConflictType =
  | 'KAKOFONIA_RESORTOWA'
  | 'BALON_PRÓBNY'
  | 'SPRZECZNOŚĆ_Z_EXPOSE'
  | 'NAPIĘCIE_KOALICYJNE'
  | 'ROZDŹWIĘK_Z_BRUKSELĄ'
  | 'RYZYKO_PROCEDURY_NARUSZENIOWEJ'
  | 'BŁĄD_W_WYWIADZIE'
  | 'AGRESJA_WOBEC_GRUP_SPOŁECZNYCH'
  | 'ATAK_NA_RZĄD'
  | 'RYZYKO_FAKTUALNE';

export type Severity = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE';

export type AlertPriority = 'P1' | 'P2' | 'P3';

export type TargetAudience =
  | 'KPRM_PREMIER'
  | 'KPRM_KOMUNIKACJA'
  | 'MINISTER_UE'
  | 'RESORT_LEAD';

export interface MinisterLeadership {
  name: string;
  role: string;
  roleCategory: RoleCategory;
  party: CoalitionParty;
  xHandle?: string;
  responsibilities: string[];
}

export interface MinistryItem {
  id: string;
  code: string;
  namePl: string;
  shortName: string;
  coalitionParty: CoalitionParty;
  cohesionScore: number | null; // 0 - 100%, null when no verified basis exists
  activeAlertsCount: number;
  lastStatementDate: string;
  leadership: MinisterLeadership[];
}

export type GovernmentActivityKind =
  | 'OFFICIAL_STATEMENT'
  | 'PRESS_CONFERENCE'
  | 'PLANNED_ACTIVITY'
  | 'MEDIA_COVERAGE';

export interface GovernmentActivity {
  id: string;
  kind: GovernmentActivityKind;
  title: string;
  summary: string;
  publishedAt: string;
  sourceUrl: string;
  sourceName: string;
  ministryCode?: string;
  ministryName?: string;
  officialName?: string;
  status?: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  location?: string;
}

export interface StatementComparison {
  id: string;
  officialName: string;
  roleTitle: string;
  ministryCode: string;
  coalitionParty: CoalitionParty;
  quote: string;
  source: string;
  publishedAt: string;
}

export interface NarrativeConflictItem {
  id: string;
  conflictType: ConflictType;
  severity: Severity;
  title: string;
  summary: string;
  topic: string;
  detectedAt: string;
  resolutionStatus: 'DETECTED' | 'REVIEWED' | 'ACKNOWLEDGED' | 'RESOLVED';
  statements: StatementComparison[];
  euImpact?: {
    infringementRisk: boolean;
    euDirectiveOrArea: string;
    brusselsContext: string;
  };
  recommendedAction: string;
  ministriesInvolved?: string[];
}

export interface SystemMetricSummary {
  overallCohesionIndex: number | null;
  activeP1Alerts: number;
  activeP2Alerts: number;
  totalMonitoredStatementsToday: number;
  monitoredMinistriesCount: number;
  monitoredOfficialsCount: number;
}
