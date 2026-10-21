'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OFFICIAL_MINISTRIES } from '@/lib/constants';

interface LegislativeDraftCheck {
  id: string;
  rclNumber: string;
  title: string;
  applicantMinistry: string;
  applicantMinister: string;
  skrmApprovalStatus: 'UZGODNIONE' | 'BLOKADA_SKRM' | 'W_TRAKCIE_UZGODNIEN' | 'BALON_PROBNY';
  fiscalImpactAssessment: 'POZYTYWNA_MF' | 'BRAK_ZGODNY_MF' | 'WYMAGA_KONSULTACJI';
  notes: string;
}

const LEGISLATIVE_DRAFTS_MONITORED: LegislativeDraftCheck[] = [
  {
    id: 'leg-01',
    rclNumber: 'UD-142',
    title: 'Projekt ustawy o zmianie ustawy o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych (Składka zdrowotna)',
    applicantMinistry: 'MRiT / PSL',
    applicantMinister: 'Krzysztof Paszyk',
    skrmApprovalStatus: 'BALON_PROBNY',
    fiscalImpactAssessment: 'BRAK_ZGODNY_MF',
    notes: 'Projekt ogłoszony medialnie przed przekazaniem do uzgodnień międzyresortowych. Sprzeczność z limitami deficytu MF.',
  },
  {
    id: 'leg-02',
    rclNumber: 'UD-189',
    title: 'Projekt ustawy o wsparciu kredytobiorców na rynku mieszkaniowym (Program Kredyt na start)',
    applicantMinistry: 'MRiT',
    applicantMinister: 'Krzysztof Paszyk',
    skrmApprovalStatus: 'BLOKADA_SKRM',
    fiscalImpactAssessment: 'WYMAGA_KONSULTACJI',
    notes: 'Weto koalicyjne ze strony MFiPR (Polska 2050) i Lewicy. Skierowano do zespołu roboczego SKRM.',
  },
  {
    id: 'leg-03',
    rclNumber: 'UD-98',
    title: 'Projekt ustawy o zmianie ustawy o Krajowej Radzie Sądownictwa (Praworządność)',
    applicantMinistry: 'MS',
    applicantMinister: 'Adam Bodnar',
    skrmApprovalStatus: 'UZGODNIONE',
    fiscalImpactAssessment: 'POZYTYWNA_MF',
    notes: 'Pełna zgodność z harmonogramem rządu i kamieniami milowymi KPO. Zgoda Komitetu do Spraw Europejskich.',
  },
  {
    id: 'leg-04',
    rclNumber: 'UD-215',
    title: 'Projekt ustawy o finansowaniu strategicznych inwestycji obronnych (Tarcza Wschód)',
    applicantMinistry: 'MON',
    applicantMinister: 'Władysław Kosiniak-Kamysz',
    skrmApprovalStatus: 'UZGODNIONE',
    fiscalImpactAssessment: 'POZYTYWNA_MF',
    notes: 'Priorytet rządowy KPRM. Kontrasygnata MF i MON, przyspieszony tryb legislacyjny.',
  },
];

export default function SzefKprmPage() {
  const [drafts, setDrafts] = useState<LegislativeDraftCheck[]>(LEGISLATIVE_DRAFTS_MONITORED);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (id: string, actionType: string) => {
    setActionNotice(`Zastosowano dyspozycję SKRM: ${actionType} dla projektu ${id}. Zaktualizowano w systemie KPRM.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredDrafts = drafts.filter((d) =>
    filterStatus === 'ALL' ? true : d.skrmApprovalStatus === filterStatus
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-6 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kancelaria Prezesa Rady Ministrów • Nadzór Administracyjny</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Pulpit Szefa KPRM i Przewodniczącego SKRM
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Koordynacja pracy 19 ministerstw, weryfikacja dyscypliny wiceministrów, Stały Komitet Rady Ministrów (SKRM) oraz zapobieganie samowolce legislacyjnej w Wykazie prac rządu.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-right">
            <span className="text-slate-400 block text-[10px]">Szef KPRM:</span>
            <span className="text-slate-100 font-bold">Jan Grabiec</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-right">
            <span className="text-slate-400 block text-[10px]">Przewodniczący SKRM:</span>
            <span className="text-amber-400 font-bold">Maciej Berek</span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="rounded-xl bg-blue-950/80 border border-blue-800 p-4 text-xs font-mono text-blue-300">
          {actionNotice}
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Projekty w wykazie prac</div>
          <div className="text-3xl font-extrabold text-white font-mono">148</div>
          <div className="text-[11px] text-slate-400 font-mono">Zarejestrowane druki rządowe</div>
        </div>

        <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-1">
          <div className="text-xs font-mono text-rose-300">Balony próbne bez zgody SKRM</div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">2 projekty</div>
          <div className="text-[11px] text-rose-300 font-mono">Wstrzymano bieg legislacyjny</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Pozytywna opinia MF</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">82%</div>
          <div className="text-[11px] text-slate-400 font-mono">Zgodność z dyscypliną budżetową</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Najbliższy Stały Komitet</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">Czwartek 10:00</div>
          <div className="text-[11px] text-slate-400 font-mono">Porządek: 12 punktów</div>
        </div>
      </div>

      {/* SECTION: Legislative Discipline Radar (SKRM Gatekeeper) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Bramka Stałego Komitetu Rady Ministrów
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Weryfikacja inicjatyw legislacyjnych przed skierowaniem na Radę Ministrów
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Wszystkie ({drafts.length})
            </button>
            <button
              onClick={() => setFilterStatus('BALON_PROBNY')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterStatus === 'BALON_PROBNY'
                  ? 'bg-rose-900/80 text-rose-200 font-bold border border-rose-700'
                  : 'bg-slate-950 text-rose-400 hover:text-white'
              }`}
            >
              Balony próbne
            </button>
            <button
              onClick={() => setFilterStatus('BLOKADA_SKRM')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterStatus === 'BLOKADA_SKRM'
                  ? 'bg-amber-900/80 text-amber-200 font-bold border border-amber-700'
                  : 'bg-slate-950 text-amber-400 hover:text-white'
              }`}
            >
              Blokady SKRM
            </button>
            <button
              onClick={() => setFilterStatus('UZGODNIONE')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterStatus === 'UZGODNIONE'
                  ? 'bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-700'
                  : 'bg-slate-950 text-emerald-400 hover:text-white'
              }`}
            >
              Uzgodnione
            </button>
          </div>
        </div>

        {/* Drafts Feed */}
        <div className="space-y-4">
          {filteredDrafts.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-xs font-bold text-slate-300">
                    {d.rclNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Wnioskodawca: <strong className="text-white">{d.applicantMinistry}</strong> ({d.applicantMinister})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${
                      d.skrmApprovalStatus === 'BALON_PROBNY'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : d.skrmApprovalStatus === 'BLOKADA_SKRM'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {d.skrmApprovalStatus.replace('_', ' ')}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      d.fiscalImpactAssessment === 'POZYTYWNA_MF'
                        ? 'bg-emerald-950/60 text-emerald-400'
                        : 'bg-rose-950/60 text-rose-400'
                    }`}
                  >
                    MF: {d.fiscalImpactAssessment.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-100">{d.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  <strong className="text-amber-400 font-mono">Uwagi KPRM:</strong> {d.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-500">Kancelaria Prezesa Rady Ministrów</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction(d.rclNumber, 'Zażądano OSR i oceny MF')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Żądaj ponownego OSR
                  </button>
                  <button
                    onClick={() => handleAction(d.rclNumber, 'Wstrzymano bieg na SKRM')}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors font-semibold"
                  >
                    Wstrzymaj na SKRM
                  </button>
                  <button
                    onClick={() => handleAction(d.rclNumber, 'Dopuszczono pod obrady rządu')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors font-semibold"
                  >
                    Dopuść pod obrady
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Ministries Discipline Ranking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
            Ranking spójności i dyscypliny resortowej
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Nadzór Szefa KPRM nad 19 ministerstwami
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_MINISTRIES.slice(0, 9).map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-sm">{m.code}</span>
                <span
                  className={`font-mono font-bold ${
                    m.cohesionScore >= 90
                      ? 'text-emerald-400'
                      : m.cohesionScore >= 80
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {m.cohesionScore}% spójności
                </span>
              </div>
              <div className="text-slate-300 font-medium truncate">{m.namePl}</div>
              <div className="text-[11px] font-mono text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                <span>Partia: {m.coalitionParty}</span>
                <span>Alerty: {m.activeAlertsCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
