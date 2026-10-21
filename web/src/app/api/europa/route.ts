import { NextResponse } from 'next/server';

export async function GET() {
  const euSignals = {
    infringements: [
      {
        id: 'inf-2026-01',
        title: 'Postępowanie w sprawie transpozycji dyrektywy ETS2',
        directiveRef: '2023/959/UE',
        riskLevel: 'CRITICAL',
        deadline: '2026-11-30',
        impactSummary: 'Zagrożenie wstrzymaniem środków z Funduszu Modernizacyjnego w razie braku harmonogramu wdrożenia.',
      },
      {
        id: 'inf-2026-02',
        title: 'Dyrektywa o jakości powietrza i normach zanieczyszczeń',
        directiveRef: '2008/50/WE',
        riskLevel: 'HIGH',
        deadline: '2026-12-15',
        impactSummary: 'Wezwanie do usunięcia uchybienia w 4 strefach przemysłowych.',
      },
    ],
    kpoMilestones: [
      {
        id: 'kpo-b1',
        code: 'B1G',
        title: 'Wejście w życie ustawy o reformie planowania przestrzennego',
        status: 'ON_TRACK',
        targetQuarter: 'Q4 2026',
      },
      {
        id: 'kpo-a4',
        code: 'A4G',
        title: 'Ujednolicenie procedur odwoławczych w zamówieniach publicznych',
        status: 'AT_RISK',
        targetQuarter: 'Q1 2027',
      },
    ],
    upcomingCouncils: [
      {
        date: '2026-11-17',
        name: 'Rada do Spraw Ogólnych (GAC)',
        city: 'Bruksela',
        leadOfficial: 'Adam Szłapka',
        mainAgenda: 'Przygotowanie do szczytu Rady Europejskiej, praworządność (art. 7).',
      },
      {
        date: '2026-11-24',
        name: 'Rada ds. Środowiska (ENVI)',
        city: 'Bruksela',
        leadOfficial: 'Urszula Zielińska',
        mainAgenda: 'Rewizja ram ETS2 i cele redukcyjne 2040.',
      },
    ],
  };

  return NextResponse.json(euSignals);
}
