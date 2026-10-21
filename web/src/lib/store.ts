import { NarrativeConflictItem, SystemMetricSummary } from '@/types';
import { OFFICIAL_MINISTRIES } from './constants';

export const INITIAL_METRICS: SystemMetricSummary = {
  overallCohesionIndex: 89.4,
  activeP1Alerts: 2,
  activeP2Alerts: 4,
  totalMonitoredStatementsToday: 184,
  monitoredMinistriesCount: OFFICIAL_MINISTRIES.length,
  monitoredOfficialsCount: 112,
};

export const INITIAL_CONFLICTS: NarrativeConflictItem[] = [
  {
    id: 'conf-2026-001',
    conflictType: 'NAPIĘCIE_KOALICYJNE',
    severity: 'P1_CRITICAL',
    title: 'Spór w temacie kredytu mieszkaniowego: Ministerstwo Finansów vs Ministerstwo Rozwoju i Technologii',
    summary:
      'Rozbieżność stanowisk koalicyjnych dotycząca finansowania programu dopłat do kredytów mieszkaniowych w projekcie budżetu państwa.',
    topic: 'Kredyt mieszkaniowy 0%',
    detectedAt: '2026-10-21T17:40:00Z',
    resolutionStatus: 'DETECTED',
    statements: [
      {
        id: 'st-01',
        officialName: 'Andrzej Domański',
        roleTitle: 'Minister Finansów',
        ministryCode: 'MF',
        coalitionParty: 'KO',
        quote:
          'W obecnym kształcie budżetu nie przewidziano dodatkowych środków na dopłaty do kredytów komercyjnych w formule proponowanej przez koalicjanta.',
        source: 'Rozmowa radiowa, RMF FM',
        publishedAt: '2026-10-21T08:15:00Z',
      },
      {
        id: 'st-02',
        officialName: 'Krzysztof Paszyk',
        roleTitle: 'Minister Rozwoju i Technologii',
        ministryCode: 'MRiT',
        coalitionParty: 'PSL',
        quote:
          'Program wsparcia mieszkalnictwa i kredyt 0% to zobowiązanie koalicyjne, które zostanie uruchomione zgodnie z planem w pierwszym kwartale.',
        source: 'Konferencja prasowa MRiT',
        publishedAt: '2026-10-21T12:00:00Z',
      },
    ],
    recommendedAction:
      'Zwołanie pilnego spotkania koordynacyjnego w KPRM przed wieczornym posiedzeniem komitetu stałego.',
  },
  {
    id: 'conf-2026-002',
    conflictType: 'ROZDŹWIĘK_Z_BRUKSELĄ',
    severity: 'P1_CRITICAL',
    title: 'Deklaracja w sprawie dyrektywy ETS2 kolidująca ze stanowiskiem negocjacyjnym w Radzie UE',
    summary:
      'Wypowiedź medialna zapowiadająca bezwarunkowe zawieszenie wdrażania ETS2 stwarza ryzyko zakłócenia sojuszy negocjacyjnych przed Radą ds. Środowiska.',
    topic: 'Dyrektywa ETS2 i pakt klimatyczny',
    detectedAt: '2026-10-21T12:45:00Z',
    resolutionStatus: 'DETECTED',
    statements: [
      {
        id: 'st-03',
        officialName: 'Miłosz Motyka',
        roleTitle: 'Podsekretarz Stanu',
        ministryCode: 'MKiŚ',
        coalitionParty: 'PSL',
        quote:
          'Polska jednostronnie odrzuci wymogi ETS2 w obszarze transportu i budownictwa, bez względu na stanowisko Komisji Europejskiej.',
        source: 'Wywiad telewizyjny, Polsat News',
        publishedAt: '2026-10-21T07:45:00Z',
      },
    ],
    euImpact: {
      infringementRisk: true,
      euDirectiveOrArea: 'Dyrektywa 2003/87/WE (z rewizją 2023)',
      brusselsContext:
        'Koliduje z pakietem korekt wnioskowanym przez ministra ds. UE na forum Rady Unii Europejskiej.',
    },
    recommendedAction:
      'Opublikowanie ujednoliconego komunikatu KPRM oraz pionu ministra ds. UE podkreślającego procedury rewizji dyrektywy w ramach UE.',
  },
  {
    id: 'conf-2026-003',
    conflictType: 'BALON_PRÓBNY',
    severity: 'P2_HIGH',
    title: 'Zapowiedź zmian w podatku od zysków kapitałowych bez uzgodnienia z KPRM',
    summary:
      'Wiceminister zapowiedział obniżenie stawki podatku Belki bez wcześniejszego wpisania założeń do Wykazu prac legislacyjnych rządu.',
    topic: 'Podatek od zysków kapitałowych',
    detectedAt: '2026-10-21T14:10:00Z',
    resolutionStatus: 'REVIEWED',
    statements: [
      {
        id: 'st-04',
        officialName: 'Jarosław Neneman',
        roleTitle: 'Podsekretarz Stanu',
        ministryCode: 'MF',
        coalitionParty: 'KO',
        quote:
          'Przygotowujemy zwolnienie z podatku do progu 100 tysięcy złotych, projekt trafi do Sejmu w ciągu trzech tygodni.',
        source: 'Wystąpienie na Forum Finansowym',
        publishedAt: '2026-10-21T11:30:00Z',
      },
    ],
    recommendedAction:
      'Wstrzymanie dalszych komunikatów do czasu przedstawienia oceny skutków regulacji na posiedzeniu Stałego Komitetu Rady Ministrów.',
  },
  {
    id: 'conf-2026-004',
    conflictType: 'KAKOFONIA_RESORTOWA',
    severity: 'P2_HIGH',
    title: 'Sprzeczne dane dotyczące terminów reformy składki zdrowotnej: MZ vs MRPiPS',
    summary:
      'Resorty zdrowia oraz rodziny przedstawiły odmienne kalkulacje skutków ubytku wpływów do Narodowego Funduszu Zdrowia.',
    topic: 'Składka zdrowotna przedsiębiorców',
    detectedAt: '2026-10-21T15:20:00Z',
    resolutionStatus: 'DETECTED',
    statements: [
      {
        id: 'st-05',
        officialName: 'Jolanta Sobierańska-Grenda',
        roleTitle: 'Ministra Zdrowia',
        ministryCode: 'MZ',
        coalitionParty: 'NON_PARTISAN',
        quote:
          'Koszty reformy muszą zostać w pełni zrekompensowane z dotacji budżetowej, aby szpitale powiatowe utrzymały płynność.',
        source: 'Briefing prasowy w Sejmie',
        publishedAt: '2026-10-21T13:10:00Z',
      },
      {
        id: 'st-06',
        officialName: 'Agnieszka Dziemianowicz-Bąk',
        roleTitle: 'Minister Rodziny, Pracy i Polityki Społecznej',
        ministryCode: 'MRPiPS',
        coalitionParty: 'NOWA_LEWICA',
        quote:
          'Nie ma zgody na cięcia w nakładach na ochronę zdrowia kosztem pracowników etatowych w celu finansowania ulg.',
        source: 'Wpis oficjalny na portalu X',
        publishedAt: '2026-10-21T14:45:00Z',
      },
    ],
    recommendedAction:
      'Dyskusja na szczeblu szefów partii koalicyjnych przed publikacją projektu autopoprawki rządowej.',
  },
];
