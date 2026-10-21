'use client';

import React, { useState } from 'react';
import { OFFICIAL_MINISTRIES } from '@/lib/constants';
import { CoalitionParty } from '@/types';

interface LegislativeInitiative {
  id: string;
  title: string;
  ministryCode: string;
  leadPerson: string;
  party: 'KO' | 'PSL' | 'POLSKA_2050' | 'NOWA_LEWICA';
  kprmStatus: 'ZATWIERDZONY' | 'UZGODNIENIA_MIEDZYRESORTOWE' | 'BALON_PROBNY';
  kprmStatusLabel: string;
  osrStatus: 'ZAAKCEPTOWANA' | 'W_WERYFIKACJI' | 'BRAK_OSR';
  conflictRisk: 'P1_CRITICAL' | 'P2_HIGH' | 'NONE';
  description: string;
  coalitionFrictionNote?: string;
  presidentialVetoRisk: 'KRYTYCZNE' | 'BARDZO_WYSOKIE' | 'SREDNIE' | 'NISKIE' | 'MINIMALNE';
  presidentialVetoNote: string;
}

const LEGISLATIVE_INITIATIVES: LegislativeInitiative[] = [
  {
    id: 'UD124',
    title: 'Ustawa o zmianie zasad naliczania składki zdrowotnej dla przedsiębiorców',
    ministryCode: 'MRiT',
    leadPerson: 'Krzysztof Paszyk (Minister)',
    party: 'PSL',
    kprmStatus: 'BALON_PROBNY',
    kprmStatusLabel: 'Jednostronny balon próbny (brak zgody MF i KERM)',
    osrStatus: 'BRAK_OSR',
    conflictRisk: 'P1_CRITICAL',
    description: 'Propozycja radykalnego powrotu do ryczałtowej składki zdrowotnej dla przedsiębiorców bez wskazania źródeł pokrycia 5 mld zł ubytku w Narodowym Funduszu Zdrowia.',
    coalitionFrictionNote: 'Otwarty sprzeciw Ministra Finansów (Andrzej Domański) oraz Minister Zdrowia (Izabela Leszczyna). Kwestia skierowana do negocjacji na szczeblu liderów koalicji.',
    presidentialVetoRisk: 'SREDNIE',
    presidentialVetoNote: 'Pałac Prezydencki nie wetuje ulg podatkowych dla przedsiębiorców, ale podnosi ryzyko ograniczenia dostępności szpitali powiatowych. Ryzyko weta umiarkowane.',
  },
  {
    id: 'UD202',
    title: 'Program mieszkaniowy Kredyt Na Start (dopłaty do rat kredytów hipotecznych)',
    ministryCode: 'MRiT',
    leadPerson: 'Krzysztof Paszyk (Minister)',
    party: 'PSL',
    kprmStatus: 'BALON_PROBNY',
    kprmStatusLabel: 'Balon próbny bez konsensusu koalicyjnego',
    osrStatus: 'W_WERYFIKACJI',
    conflictRisk: 'P1_CRITICAL',
    description: 'Projekt dopłat do kredytów mieszkaniowych dla młodych rodzin na zakup pierwszego lokalu.',
    coalitionFrictionNote: 'Publiczne weto ze strony Polski 2050 (Katarzyna Pełczyńska-Nałęcz) oraz Nowej Lewicy. Ryzyko odrzucenia w Sejmie w przypadku braku kompromisu z budownictwem społecznym.',
    presidentialVetoRisk: 'NISKIE',
    presidentialVetoNote: 'Prezydent przychylny programom wspierania zakupu pierwszego lokalu dla rodzin z dziećmi. Brak przesłanek do weta.',
  },
  {
    id: 'UD89',
    title: 'Ustawa o wsparciu społecznych form rozwoju mieszkalnictwa i budownictwie komunalnym',
    ministryCode: 'MFiPR / MRiT',
    leadPerson: 'Katarzyna Pełczyńska-Nałęcz / Tomasz Lewandowski',
    party: 'POLSKA_2050',
    kprmStatus: 'UZGODNIENIA_MIEDZYRESORTOWE',
    kprmStatusLabel: 'W toku uzgodnień międzyresortowych (SKRM)',
    osrStatus: 'ZAAKCEPTOWANA',
    conflictRisk: 'P2_HIGH',
    description: 'Przekierowanie części środków Funduszu Dopłat BGK na bezpośrednie budownictwo czynszowe przez samorządy (SIM i TBS).',
    coalitionFrictionNote: 'Projekt czeka na ostateczną akceptację Komitetu Ekonomicznego RM w zakresie harmonogramu wypłat z KPO.',
    presidentialVetoRisk: 'NISKIE',
    presidentialVetoNote: 'Inwestycje samorządowe i społeczne cieszą się aprobatą Kancelarii Prezydenta RP.',
  },
  {
    id: 'UD15',
    title: 'Ustawa o Narodowym Programie Odstraszania i Obrony — Tarcza Wschód',
    ministryCode: 'MON',
    leadPerson: 'Władysław Kosiniak-Kamysz / Cezary Tomczyk',
    party: 'PSL',
    kprmStatus: 'ZATWIERDZONY',
    kprmStatusLabel: 'Uzgodniony w koalicji (zgodny z expose Premiera)',
    osrStatus: 'ZAAKCEPTOWANA',
    conflictRisk: 'NONE',
    description: 'Pakiet legislacyjny umożliwiający uproszczone wywłaszczenia pod umocnienia graniczne oraz finansowanie infrastruktury obronnej ze specjalnego funduszu (10 mld zł).',
    coalitionFrictionNote: 'Pełna dyscyplina koalicyjna. Projekt rekomendowany przez KPRM do szybkiej ścieżki sejmowej.',
    presidentialVetoRisk: 'MINIMALNE',
    presidentialVetoNote: 'Ścisła koordynacja z Biurem Bezpieczeństwa Narodowego (BBN) i Prezydentem RP jako Zwierzchnikiem Sił Zbrojnych. Gwarantowany podpis.',
  },
  {
    id: 'UD54',
    title: 'Ustawa o zmianie ustawy o Krajowej Radzie Sądownictwa (przywrócenie praworządności)',
    ministryCode: 'MS',
    leadPerson: 'Adam Bodnar (Minister Sprawiedliwości)',
    party: 'KO',
    kprmStatus: 'ZATWIERDZONY',
    kprmStatusLabel: 'Zatwierdzony przez Radę Ministrów',
    osrStatus: 'ZAAKCEPTOWANA',
    conflictRisk: 'NONE',
    description: 'Wybór sędziowskiej części KRS przez wszystkich sędziów w bezpośrednich wyborach, wykluczenie tzw. neosędziów.',
    coalitionFrictionNote: 'Wspólne stanowisko koalicji. Analiza ryzyka dotyczy weta prezydenckiego lub skierowania do TK.',
    presidentialVetoRisk: 'KRYTYCZNE',
    presidentialVetoNote: 'Pewne weto lub skierowanie do Trybunału Konstytucyjnego w trybie kontroli prewencyjnej (zarzut podważania prerogatywy prezydenckiej powoływania sędziów). KPRM przygotowuje równoległe rozporządzenia.',
  },
  {
    id: 'UD77',
    title: 'Projekt ustawy o powrocie do dwóch niedziel handlowych w miesiącu',
    ministryCode: 'MRiT / Sejm',
    leadPerson: 'Ryszard Petru / Posłowie Polski 2050',
    party: 'POLSKA_2050',
    kprmStatus: 'BALON_PROBNY',
    kprmStatusLabel: 'Jednostronna inicjatywa bez poparcia rządu',
    osrStatus: 'BRAK_OSR',
    conflictRisk: 'P2_HIGH',
    description: 'Inicjatywa liberalizacji handlu w niedziele z podwójnym wynagrodzeniem dla pracowników.',
    coalitionFrictionNote: 'Stanowczy sprzeciw Ministry Rodziny, Pracy i Polityki Społecznej Agnieszki Dziemianowicz-Bąk (Lewica) oraz związków zawodowych. Projekt nie jest projektem rządowym.',
    presidentialVetoRisk: 'BARDZO_WYSOKIE',
    presidentialVetoNote: 'Prezydent Andrzej Duda wielokrotnie deklarował obronę ustawy o ograniczeniu handlu w niedziele. Ustawa w obecnym kształcie nie ma szans na podpis.',
  },
];

export default function ResortyPage() {
  const [activeTab, setActiveTab] = useState<'MINISTRIES' | 'LEGISLATION'>('MINISTRIES');
  const [selectedParty, setSelectedParty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMinistryId, setExpandedMinistryId] = useState<string | null>(null);
  const [legislationFilter, setLegislationFilter] = useState<'ALL' | 'BALON_PROBNY' | 'UZGODNIENIA' | 'ZATWIERDZONE'>('ALL');

  const getPartyClass = (party: string) => {
    switch (party) {
      case 'KO':
        return 'bg-orange-950 text-orange-400 border border-orange-800';
      case 'PSL':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
      case 'POLSKA_2050':
        return 'bg-yellow-950 text-yellow-400 border border-yellow-800';
      case 'NOWA_LEWICA':
        return 'bg-rose-950 text-rose-400 border border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-amber-400';
    return 'text-red-400';
  };

  const filteredMinistries = OFFICIAL_MINISTRIES.filter((m) => {
    const matchesParty = selectedParty === 'ALL' || m.coalitionParty === selectedParty;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesParty;

    const matchesName = m.namePl.toLowerCase().includes(query) || m.code.toLowerCase().includes(query);
    const matchesLead = m.leadership.some(
      (l) => l.name.toLowerCase().includes(query) || l.role.toLowerCase().includes(query)
    );
    return matchesParty && (matchesName || matchesLead);
  });

  const filteredLegislation = LEGISLATIVE_INITIATIVES.filter((init) => {
    if (legislationFilter === 'BALON_PROBNY') return init.kprmStatus === 'BALON_PROBNY';
    if (legislationFilter === 'UZGODNIENIA') return init.kprmStatus === 'UZGODNIENIA_MIEDZYRESORTOWE';
    if (legislationFilter === 'ZATWIERDZONE') return init.kprmStatus === 'ZATWIERDZONY';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedMinistryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Kancelaria Prezesa Rady Ministrów • Nadzór resortowy</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            {activeTab === 'MINISTRIES'
              ? 'Katalog resortów i skład kierownictwa rządu'
              : 'Dyscyplina legislacyjna i wykaz prac rządu (RCL)'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitorowanie 19 ministerstw, składu kierownictw oraz weryfikacja inicjatyw z Wykazu prac legislacyjnych rządu (RCL).
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('MINISTRIES')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'MINISTRIES'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Katalog resortów (19)
          </button>
          <button
            onClick={() => setActiveTab('LEGISLATION')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'LEGISLATION'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Dyscyplina RCL</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
              3 balony
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: MINISTRIES DIRECTORY */}
      {activeTab === 'MINISTRIES' && (
        <div className="space-y-6">
          {/* Filters and search toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Szukaj resortu lub członka rządu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 w-64 font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              <button
                onClick={() => setSelectedParty('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedParty === 'ALL'
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Wszystkie ({OFFICIAL_MINISTRIES.length})
              </button>
              {(['KO', 'PSL', 'POLSKA_2050', 'NOWA_LEWICA'] as CoalitionParty[]).map((party) => (
                <button
                  key={party}
                  onClick={() => setSelectedParty(party)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedParty === party
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {party}
                </button>
              ))}
            </div>
          </div>

          {/* Ministries list with leadership drawers */}
          <div className="space-y-3">
            {filteredMinistries.map((m) => {
              const isExpanded = expandedMinistryId === m.id;
              const leadMinister = m.leadership[0];

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all duration-150"
                >
                  <div
                    onClick={() => toggleExpand(m.id)}
                    className="p-4 cursor-pointer hover:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-start md:items-center space-x-3">
                      <span className="font-mono text-sm font-bold bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-white min-w-[70px] text-center">
                        {m.code}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-100 text-sm font-sans">{m.namePl}</h3>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getPartyClass(m.coalitionParty)}`}>
                            {m.coalitionParty}
                          </span>
                        </div>
                        {leadMinister && (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Kieruje: <span className="text-slate-300 font-medium">{leadMinister.name}</span> ({leadMinister.role})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[11px]">Wskaźnik spójności</span>
                        <span className={`font-bold text-sm ${getScoreColor(m.cohesionScore)}`}>
                          {m.cohesionScore}%
                        </span>
                      </div>

                      <div className="text-center min-w-[80px]">
                        <span className="text-slate-400 block text-[11px]">Alerty</span>
                        {m.activeAlertsCount > 0 ? (
                          <span className="rounded bg-red-950 px-2 py-0.5 font-bold text-red-400 border border-red-800 inline-block mt-0.5">
                            {m.activeAlertsCount} aktywne
                          </span>
                        ) : (
                          <span className="text-slate-500 inline-block mt-0.5">0 uwag</span>
                        )}
                      </div>

                      <div className="text-right hidden lg:block">
                        <span className="text-slate-400 block text-[11px]">Ostatnia wypowiedź</span>
                        <span className="text-slate-300">
                          {new Date(m.lastStatementDate).toLocaleDateString('pl-PL', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800"
                      >
                        {isExpanded ? 'Ukryj skład' : 'Pokaż skład'}
                      </button>
                    </div>
                  </div>

                  {/* Leadership Drawer */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/70 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Skład kierownictwa resortu ({m.leadership.length} osób)
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500">
                          Aktualizacja wg BIP KPRM
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {m.leadership.map((person, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-3 space-y-2 text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-200">{person.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{person.role}</div>
                              </div>
                              <span
                                className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${getPartyClass(
                                  person.party
                                )}`}
                              >
                                {person.party}
                              </span>
                            </div>

                            {person.xHandle && (
                              <div className="font-mono text-[11px] text-sky-400">
                                {person.xHandle}
                              </div>
                            )}

                            {person.responsibilities.length > 0 && (
                              <div className="pt-2 border-t border-slate-800/60 text-slate-400 text-[11px]">
                                <span className="text-slate-300 font-semibold">Zakres:</span>{' '}
                                {person.responsibilities.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LEGISLATIVE DISCIPLINE (RCL) */}
      {activeTab === 'LEGISLATION' && (
        <div className="space-y-6">
          {/* Summary Dashboard Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Wskaźnik dyscypliny RCL
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">67%</div>
              <span className="text-xs text-slate-400">4 z 6 projektów uzgodnione w KPRM</span>
            </div>

            <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                Balony próbne bez zgody
              </span>
              <div className="text-2xl font-bold font-mono text-rose-400">3 projekty</div>
              <span className="text-xs text-rose-300">Wymagają interwencji Premiera i SKRM</span>
            </div>

            <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                W toku uzgodnień SKRM
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400">1 projekt</div>
              <span className="text-xs text-slate-400">Weryfikacja OSR i zgodności z KPO</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Autoryzowane w koalicji
              </span>
              <div className="text-2xl font-bold font-mono text-white">2 projekty</div>
              <span className="text-xs text-emerald-400">Zgodne z expose i umową koalicyjną</span>
            </div>
          </div>

          {/* Legislative Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-xs font-mono text-slate-300">
              Filtruj wpisy z Wykazu prac legislacyjnych rządu:
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              <button
                onClick={() => setLegislationFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  legislationFilter === 'ALL'
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Wszystkie ({LEGISLATIVE_INITIATIVES.length})
              </button>
              <button
                onClick={() => setLegislationFilter('BALON_PROBNY')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  legislationFilter === 'BALON_PROBNY'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-950 text-rose-400 hover:text-white border border-rose-900/50'
                }`}
              >
                Balony próbne (P1/P2)
              </button>
              <button
                onClick={() => setLegislationFilter('UZGODNIENIA')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  legislationFilter === 'UZGODNIENIA'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-amber-400 hover:text-white border border-amber-900/50'
                }`}
              >
                Uzgodnienia SKRM
              </button>
              <button
                onClick={() => setLegislationFilter('ZATWIERDZONE')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  legislationFilter === 'ZATWIERDZONE'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-950 text-emerald-400 hover:text-white border border-emerald-900/50'
                }`}
              >
                Zatwierdzone w koalicji
              </button>
            </div>
          </div>

          {/* Legislative Initiatives List */}
          <div className="space-y-4">
            {filteredLegislation.map((item) => {
              const isTrial = item.kprmStatus === 'BALON_PROBNY';
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 shadow-xl transition-all ${
                    isTrial
                      ? 'border-rose-800/80 bg-rose-950/15'
                      : item.kprmStatus === 'UZGODNIENIA_MIEDZYRESORTOWE'
                      ? 'border-amber-800/80 bg-amber-950/10'
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white">
                        {item.id}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        Resort:{' '}
                        <strong className="text-white font-bold">{item.ministryCode}</strong> (
                        {item.leadPerson})
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getPartyClass(
                          item.party
                        )}`}
                      >
                        {item.party}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                          isTrial
                            ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                            : item.kprmStatus === 'UZGODNIENIA_MIEDZYRESORTOWE'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {item.kprmStatusLabel}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${
                          item.osrStatus === 'ZAAKCEPTOWANA'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : item.osrStatus === 'W_WERYFIKACJI'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-red-950 text-red-400 border-red-800'
                        }`}
                      >
                        OSR: {item.osrStatus}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  {item.coalitionFrictionNote && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isTrial
                          ? 'border-rose-800/60 bg-rose-950/40 text-rose-200'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300'
                      }`}
                    >
                      <strong className="font-mono text-amber-400 block mb-1">
                        Ocena spójności rządowej KPRM:
                      </strong>
                      {item.coalitionFrictionNote}
                    </div>
                  )}

                  {/* Presidential Veto Risk Box */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 text-xs space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="font-mono text-slate-400 font-semibold uppercase text-[11px]">
                        Ryzyko weta prezydenckiego / TK (Pałac Prezydencki):
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border self-start sm:self-auto ${
                          item.presidentialVetoRisk === 'KRYTYCZNE' || item.presidentialVetoRisk === 'BARDZO_WYSOKIE'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : item.presidentialVetoRisk === 'SREDNIE'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        RYZYKO: {item.presidentialVetoRisk}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {item.presidentialVetoNote}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
