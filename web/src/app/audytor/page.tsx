'use client';

import React, { useEffect, useState } from 'react';
import type { MinistryItem } from '@/types';

interface AuditResult {
  overall_risk_score: number;
  severity: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE' | 'LOW';
  category: string;
  coalition_friction: boolean;
  friction_axis: string;
  affected_ministries: string[];
  conflict_summary: string;
  prime_minister_impact: string;
  recommended_cir_directive: string;
  skrm_status: string;
}

const PRESET_CASES = [
  {
    title: 'Spór o składkę zdrowotną (MF vs PSL/MRiT)',
    officialName: 'Krzysztof Paszyk',
    roleTitle: 'Minister Rozwoju i Technologii',
    ministryCode: 'MRiT',
    coalitionParty: 'PSL',
    topic: 'Składka zdrowotna dla przedsiębiorców',
    sourceMedium: 'Poranna rozmowa RMF FM',
    statementText:
      'Polskie Stronnictwo Ludowe nie poprze budżetu na kolejny rok bez pełnego powrotu do zasad rozliczania składki zdrowotnej sprzed Polskiego Ładu. To jest nasz bezwzględny warunek koalicyjny, niezależnie od tego, co mówi Ministerstwo Finansów.',
  },
  {
    title: 'Kredyt 0% / Mieszkanie na start (MRiT vs MFiPR)',
    officialName: 'Katarzyna Pełczyńska-Nałęcz',
    roleTitle: 'Minister Funduszy i Polityki Regionalnej',
    ministryCode: 'MFiPR',
    coalitionParty: 'PL2050',
    topic: 'Dopłaty do kredytów hipotecznych',
    sourceMedium: 'Wpis na platformie X',
    statementText:
      'Kredyt 0% nie ma i nie będzie miał poparcia Polski 2050. Dopłacanie deweloperom z kieszeni podatnika tylko nakręca bańkę cenową mieszkań. Pieniądze z KPO i budżetu muszą pójść na budownictwo społeczne, a nie na zyski banków.',
  },
  {
    title: 'Procedura nadmiernego deficytu (MF w Brukseli vs wydatki)',
    officialName: 'Andrzej Domański',
    roleTitle: 'Minister Finansów',
    ministryCode: 'MF',
    coalitionParty: 'KO',
    topic: 'Dyscyplina budżetowa i wymogi Komisji Europejskiej',
    sourceMedium: 'Konferencja prasowa po posiedzeniu Rady ECOFIN',
    statementText:
      'Polska znajduje się w procedurze nadmiernego deficytu i musimy przedstawić Komisji Europejskiej wiarygodną, czteroletnią ścieżkę konsolidacji fiskalnej. Każdy resort, który planuje nowe programy wydatkowe, musi wskazać źródła ich sfinansowania lub cięcia w innych obszarach.',
  },
];

export default function AudytorPage() {
  const [ministries, setMinistries] = useState<MinistryItem[]>([]);
  const [officialName, setOfficialName] = useState(PRESET_CASES[0].officialName);
  const [roleTitle, setRoleTitle] = useState(PRESET_CASES[0].roleTitle);
  const [ministryCode, setMinistryCode] = useState(PRESET_CASES[0].ministryCode);
  const [coalitionParty, setCoalitionParty] = useState(PRESET_CASES[0].coalitionParty);
  const [topic, setTopic] = useState(PRESET_CASES[0].topic);
  const [sourceMedium, setSourceMedium] = useState(PRESET_CASES[0].sourceMedium);
  const [statementText, setStatementText] = useState(PRESET_CASES[0].statementText);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copiedVariantIndex, setCopiedVariantIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/resorty', { cache: 'no-store' })
      .then((response) => response.json() as Promise<{ ministries?: MinistryItem[] }>)
      .then((payload) => setMinistries(Array.isArray(payload.ministries) ? payload.ministries : []))
      .catch(() => setMinistries([]));
  }, []);

  const handleCopyVariant = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedVariantIndex(index);
      setTimeout(() => setCopiedVariantIndex(null), 3000);
    }
  };

  const handleSelectPreset = (c: (typeof PRESET_CASES)[0]) => {
    setOfficialName(c.officialName);
    setRoleTitle(c.roleTitle);
    setMinistryCode(c.ministryCode);
    setCoalitionParty(c.coalitionParty);
    setTopic(c.topic);
    setSourceMedium(c.sourceMedium);
    setStatementText(c.statementText);
    setAuditResult(null);
    setError(null);
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statementText.trim() || statementText.trim().length < 10) {
      setError('Wprowadź treść wypowiedzi (minimum 10 znaków).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officialName,
          roleTitle,
          ministryCode,
          coalitionParty,
          topic,
          sourceMedium,
          statementText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Nie udało się przeprowadzić audytu spójności.');
        setLoading(false);
        return;
      }

      setAuditResult(data.audit);
    } catch {
      setError('Błąd połączenia z serwerem analizy ryzyka.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'P1_CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'P2_HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'P3_MODERATE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] font-mono text-blue-300 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Silnik Google Gemini 2.5 Flash</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Audytor Spójności Rządowej AI
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Natychmiastowa analiza wypowiedzi medialnych, zapowiedzi legislacyjnych i rozbieżności
              z linią premiera.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              Czas analizy: ~1.2s
            </span>
          </div>
        </div>
      </div>

      {/* Preset fast-load chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Szybkie ładowanie bieżących spraw spornych:
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_CASES.map((c, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(c)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all text-left"
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handleRunAudit}
            className="rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-6 space-y-4 shadow-xl"
          >
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Parametry audytowanego materiału</span>
              <span className="text-[11px] text-amber-400 font-normal">KPRM Radar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Imię i nazwisko polityka
                </label>
                <input
                  type="text"
                  value={officialName}
                  onChange={(e) => setOfficialName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Funkcja / rola
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Resort / organ
                </label>
                <select
                  value={ministryCode}
                  onChange={(e) => setMinistryCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {ministries.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code} — {m.namePl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Partia koalicyjna
                </label>
                <select
                  value={coalitionParty}
                  onChange={(e) => setCoalitionParty(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="KO">Koalicja Obywatelska (KO)</option>
                  <option value="PSL">Polskie Stronnictwo Ludowe (PSL)</option>
                  <option value="PL2050">Polska 2050 (PL2050)</option>
                  <option value="NL">Nowa Lewica (NL)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Wiodący temat
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Źródło / medium
                </label>
                <input
                  type="text"
                  value={sourceMedium}
                  onChange={(e) => setSourceMedium(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Treść wypowiedzi lub założeń ustawy do audytu
              </label>
              <textarea
                rows={5}
                value={statementText}
                onChange={(e) => setStatementText(e.target.value)}
                placeholder="Wklej dokładny cytat z wywiadu, wpis z platformy X lub założenia projektu ustawy..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none font-sans leading-relaxed"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-950/60 border border-rose-800 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-medium py-3 px-4 text-sm transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Audytowanie przez Google Gemini 2.5 Flash...</span>
                </>
              ) : (
                <>
                  <span>Uruchom natychmiastowy audyt spójności</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {auditResult ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Wynik analizy KPRM
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Kwalifikacja ryzyka politycznego
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getSeverityBadge(
                      auditResult.severity
                    )}`}
                  >
                    {auditResult.severity.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Risk Score Meter */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400">Wskaźnik rozbieżności</div>
                  <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                    {auditResult.overall_risk_score}
                    <span className="text-sm font-normal text-slate-500"> / 10.0</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Kategoria zagrożenia</div>
                  <div className="text-sm font-bold text-amber-300 mt-1 font-mono">
                    {auditResult.category}
                  </div>
                </div>
              </div>

              {/* Friction Axis & Affected Ministries */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">
                    Oś sporu koalicyjnego
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mt-1">
                    {auditResult.friction_axis}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">
                    Resorty zaangażowane
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {auditResult.affected_ministries.map((code) => (
                      <span
                        key={code}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-semibold"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conflict Summary */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Sedno sprzeczności:
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                  {auditResult.conflict_summary}
                </div>
              </div>

              {/* Impact on Prime Minister */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Analiza rykoszetu dla premiera Donalda Tuska:</span>
                </div>
                <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-sm text-amber-200 leading-relaxed">
                  {auditResult.prime_minister_impact}
                </div>
              </div>

              {/* CIR directive */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Dyspozycja komunikacyjna dla rzecznika rządu (CIR):</span>
                </div>
                <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-800/40 text-sm text-blue-200 leading-relaxed font-sans">
                  {auditResult.recommended_cir_directive}
                </div>
              </div>

              {/* SKRM Status */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
                <span>Procedura rządowa / SKRM:</span>
                <span className="text-slate-200 font-semibold">{auditResult.skrm_status}</span>
              </div>

              {/* Generator bezpiecznych wariantów narracyjnych */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Generator bezpiecznych wariantów narracyjnych dla ministra:</span>
                  </span>
                  <span className="text-slate-500 font-normal">Gotowe do skopiowania</span>
                </div>

                <div className="space-y-2.5">
                  {/* Wariant 1: Koncyliacyjny */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                        Wariant 1 • Koncyliacyjny (wyciszenie sporu w koalicji)
                      </span>
                      <button
                        onClick={() =>
                          handleCopyVariant(
                            `„Kwestia ${topic} jest przedmiotem odpowiedzialnego dialogu wewnątrz koalicji. Szukamy rozwiązań łączących interesy społeczne z poszanowaniem stabilności finansów państwa.”`,
                            1
                          )
                        }
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        {copiedVariantIndex === 1 ? 'Skopiowano!' : 'Kopiuj wariant'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                      &bdquo;Kwestia {topic} jest przedmiotem odpowiedzialnego dialogu wewnątrz koalicji. Szukamy rozwiązań łączących interesy społeczne z poszanowaniem stabilności finansów państwa.&rdquo;
                    </p>
                  </div>

                  {/* Wariant 2: Twardy KPRM */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                        Wariant 2 • Twardy KPRM (dyscyplina rządowa)
                      </span>
                      <button
                        onClick={() =>
                          handleCopyVariant(
                            `„Stanowisko rządu w sprawie ${topic} zapada kolegialnie na Radzie Ministrów. Wszelkie propozycje wymagają wcześniejszego uzgodnienia w Komitecie Ekonomicznym RM i akceptacji KPRM.”`,
                            2
                          )
                        }
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        {copiedVariantIndex === 2 ? 'Skopiowano!' : 'Kopiuj wariant'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                      &bdquo;Stanowisko rządu w sprawie {topic} zapada kolegialnie na Radzie Ministrów. Wszelkie propozycje wymagają wcześniejszego uzgodnienia w Komitecie Ekonomicznym RM i akceptacji KPRM.&rdquo;
                    </p>
                  </div>

                  {/* Wariant 3: Odsyłający do SKRM */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                        Wariant 3 • Odsyłający (procedura SKRM)
                      </span>
                      <button
                        onClick={() =>
                          handleCopyVariant(
                            `„Projekt znajduje się w fazie roboczych uzgodnień międzyresortowych. Właściwym miejscem rozstrzygania ewentualnych rozbieżności jest Stały Komitet Rady Ministrów.”`,
                            3
                          )
                        }
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        {copiedVariantIndex === 3 ? 'Skopiowano!' : 'Kopiuj wariant'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                      &bdquo;Projekt znajduje się w fazie roboczych uzgodnień międzyresortowych. Właściwym miejscem rozstrzygania ewentualnych rozbieżności jest Stały Komitet Rady Ministrów.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4 border border-slate-700">
                <span className="font-mono text-lg font-bold">AI</span>
              </div>
              <h3 className="text-base font-semibold text-slate-300">
                Oczekiwanie na uruchomienie audytu
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                Wybierz jeden z gotowych przypadków powyżej lub wprowadź własny cytat i kliknij
                przycisk &quot;Uruchom natychmiastowy audyt spójności&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
