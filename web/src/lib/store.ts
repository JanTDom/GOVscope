import type { NarrativeConflictItem, SystemMetricSummary } from '@/types';

// Production data is read from verified Supabase rows. These typed defaults
// keep screens renderable while the first ingestion run is pending.
export const INITIAL_METRICS: SystemMetricSummary = {
  overallCohesionIndex: 100,
  activeP1Alerts: 0,
  activeP2Alerts: 0,
  totalMonitoredStatementsToday: 0,
  monitoredMinistriesCount: 0,
  monitoredOfficialsCount: 0,
};

export const INITIAL_CONFLICTS: NarrativeConflictItem[] = [];
