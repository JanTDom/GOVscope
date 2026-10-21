import React from 'react';
import { OFFICIAL_MINISTRIES } from '@/lib/constants';

export default function ResortyPage() {
  const ministries = OFFICIAL_MINISTRIES;

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

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          Przegląd resortów i urzędów centralnych
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Wskaźnik dyscypliny narracyjnej, spójności z linią KPRM oraz aktywności medialnej wszystkich ministerstw.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950 text-xs font-mono uppercase text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3">Kod</th>
              <th scope="col" className="px-4 py-3">Nazwa resortu</th>
              <th scope="col" className="px-4 py-3">Koalicja</th>
              <th scope="col" className="px-4 py-3 text-right">Wskaźnik spójności</th>
              <th scope="col" className="px-4 py-3 text-center">Aktywne alerty</th>
              <th scope="col" className="px-4 py-3 text-right">Ostatni komunikat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-xs">
            {ministries.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 font-bold text-white">{m.code}</td>
                <td className="px-4 py-3 font-sans text-sm text-slate-200">{m.namePl}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getPartyClass(m.coalitionParty)}`}>
                    {m.coalitionParty}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-bold text-sm ${getScoreColor(m.cohesionScore)}`}>
                  {m.cohesionScore}%
                </td>
                <td className="px-4 py-3 text-center">
                  {m.activeAlertsCount > 0 ? (
                    <span className="rounded bg-red-950 px-2 py-0.5 font-bold text-red-400 border border-red-800">
                      {m.activeAlertsCount}
                    </span>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {new Date(m.lastStatementDate).toLocaleDateString('pl-PL', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
