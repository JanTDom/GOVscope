'use client';

import React, { useState } from 'react';
import { OFFICIAL_MINISTRIES } from '@/lib/constants';
import { CoalitionParty } from '@/types';

export default function ResortyPage() {
  const [selectedParty, setSelectedParty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMinistryId, setExpandedMinistryId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedMinistryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          Katalog resortów i skład kierownictwa rządu
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Oficjalna struktura KPRM, 19 ministerstw oraz urzędów centralnych z przypisaniem partyjnym i wskaźnikiem spójności narracyjnej.
        </p>
      </div>

      {/* Filters and search toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Szukaj resortu lub członka rządu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500 w-64 font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          <button
            onClick={() => setSelectedParty('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${
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
              className={`px-2.5 py-1 rounded transition-colors ${
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
              className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden transition-all duration-150"
            >
              <div
                onClick={() => toggleExpand(m.id)}
                className="p-4 cursor-pointer hover:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
              >
                <div className="flex items-start md:items-center space-x-3">
                  <span className="font-mono text-sm font-bold bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-white min-w-[70px] text-center">
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
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-950 border border-slate-800"
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
                        className="rounded border border-slate-800/80 bg-slate-900/90 p-3 space-y-2 text-xs"
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
  );
}
