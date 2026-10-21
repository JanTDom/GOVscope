export type CoalitionParty = 'KO' | 'PSL' | 'POLSKA_2050' | 'NOWA_LEWICA' | 'NON_PARTISAN';

export type RoleCategory =
  | 'PREMIER'
  | 'WICEPREMIER'
  | 'MINISTER'
  | 'WICEMINISTER'
  | 'PELNOMOCNIK'
  | 'RZECZNIK';

export type ConflictType =
  | 'KAKOFONIA_RESORTOWA'
  | 'BALON_PRÓBNY'
  | 'SPRZECZNOŚĆ_Z_EXPOSE'
  | 'NAPIĘCIE_KOALICYJNE'
  | 'ROZDŹWIĘK_Z_BRUKSELĄ'
  | 'RYZYKO_PROCEDURY_NARUSZENIOWEJ'
  | 'BŁĄD_W_WYWIADZIE'
  | 'AGRESJA_WOBEC_GRUP_SPOŁECZNYCH';

export type Severity = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE';

export type AlertPriority = 'P1' | 'P2' | 'P3';

export type TargetAudience =
  | 'KPRM_PREMIER'
  | 'KPRM_KOMUNIKACJA'
  | 'MINISTER_UE'
  | 'RESORT_LEAD';

export interface MinistryItem {
  id: string;
  code: string;
  namePl: string;
  shortName: string;
  coalitionParty: CoalitionParty;
  cohesionScore: number; // 0 - 100%
  activeAlertsCount: number;
  lastStatementDate: string;
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
}

export interface SystemMetricSummary {
  overallCohesionIndex: number;
  activeP1Alerts: number;
  activeP2Alerts: number;
  totalMonitoredStatementsToday: number;
  monitoredMinistriesCount: number;
  monitoredOfficialsCount: number;
}
