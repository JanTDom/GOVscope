'use client';

import React from 'react';
import Image from 'next/image';

export default function MeldunekPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Action bar (hidden in print) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Kancelaria Prezesa Rady Ministrów
          </span>
          <h1 className="text-2xl font-bold text-white">Meldunek Dobowy dla Premiera</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
          >
            Drukuj / Zapisz PDF
          </button>
        </div>
      </div>

      {/* Official Executive Document Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* State / KPRM Header */}
        <div className="border-b-2 border-slate-700 print:border-black pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-xl bg-slate-950 print:bg-white border border-slate-800 print:border-none">
              <Image
                src="/govscope-logo-dark.png"
                alt="GOVscope Logo"
                width={200}
                height={70}
                className="h-12 w-auto object-contain print:invert"
              />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 print:text-neutral-700 font-bold">
                Rada Ministrów Rzeczypospolitej Polskiej
              </div>
              <div className="text-lg font-bold text-white print:text-black mt-0.5">
                Kancelaria Prezesa Rady Ministrów
              </div>
              <div className="text-xs text-slate-400 print:text-neutral-600 font-mono">
                Centrum Monitoringu Spójności Rządowej i Radaru Ryzyk
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs space-y-1">
            <div className="inline-block px-2.5 py-1 rounded bg-rose-950/80 print:bg-neutral-200 border border-rose-800/80 print:border-neutral-400 text-rose-300 print:text-black font-bold uppercase tracking-wider">
              Zastrzeżone • Egz. pojedynczy
            </div>
            <div className="text-slate-400 print:text-neutral-600">
              Nr ref.: <span className="text-slate-200 print:text-black">KPRM/MD/2026/10/22-01</span>
            </div>
            <div className="text-slate-400 print:text-neutral-600">
              Data: <span className="text-slate-200 print:text-black">22 października 2026 r.</span>
            </div>
            <div className="text-slate-400 print:text-neutral-600">
              Adresat: <span className="text-slate-200 print:text-black font-bold">Prezes Rady Ministrów Donald Tusk</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400 print:text-black font-bold mb-2">
              1. Zwięzła ocena spójności dobowej (Wskaźnik KPRM: 89.4%)
            </h2>
            <div className="p-4 rounded-xl bg-slate-950/80 print:bg-neutral-50 border border-slate-800 print:border-neutral-300 text-sm leading-relaxed text-slate-200 print:text-black space-y-2">
              <p>
                W ciągu ostatnich 24 godzin zarejestrowano <strong>48 oficjalnych wypowiedzi</strong> członków rządu
                oraz <strong>3 nowe wpisy</strong> w Wykazie prac legislacyjnych rządu.
              </p>
              <p>
                Główny wektor ryzyka komunikacyjnego koncentruje się wokół kwestii <strong>składki zdrowotnej dla przedsiębiorców</strong>{' '}
                (publiczna polemika między ministrem Andrzejem Domańskim a ministrem Krzysztofem Paszykiem) oraz{' '}
                <strong>programu dopłat do kredytów mieszkaniowych</strong> (sprzeciw minister Katarzyny Pełczyńskiej-Nałęcz wobec propozycji MRiT).
              </p>
            </div>
          </div>

          {/* Section 2: P1 Incidents Requiring Decisions */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-rose-400 print:text-black font-bold mb-2">
              2. Incydenty krytyczne P1 do natychmiastowej decyzji premiera
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/80 print:bg-neutral-50 border-l-4 border-rose-500 border border-slate-800 print:border-neutral-300">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white print:text-black">
                    P1/01: Napięcie koalicyjne wokół składki zdrowotnej (MF vs PSL)
                  </div>
                  <span className="text-[11px] font-mono text-rose-400 print:text-black font-bold">
                    PILNE
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-neutral-700 mt-2 leading-relaxed">
                  Minister Paszyk w porannym wywiadzie uzależnił poparcie budżetu od natychmiastowych cięć składki zdrowotnej,
                  podczas gdy MF wskazuje na ograniczenia wynikające z unijnej procedury nadmiernego deficytu.
                </p>
                <div className="mt-3 text-xs bg-slate-900 print:bg-neutral-200 p-2.5 rounded font-mono text-slate-300 print:text-black">
                  <span className="font-bold text-amber-400 print:text-black">Rekomendacja KPRM:</span> Zwołanie zamkniętego spotkania liderów koalicji przed posiedzeniem Rady Ministrów i wyznaczenie jednolitej linii: &quot;sprawa jest przedmiotem roboczych uzgodnień w Komitecie Ekonomicznym&quot;.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 print:bg-neutral-50 border-l-4 border-amber-500 border border-slate-800 print:border-neutral-300">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white print:text-black">
                    P2/02: Balon próbny ws. dopłat mieszkaniowych (MRiT vs MFiPR)
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 print:text-black font-bold">
                    DO UZGODNIENIA
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-neutral-700 mt-2 leading-relaxed">
                  Polska 2050 publicznie odrzuciła założenia projektu przedłożonego do wykazu prac przez MRiT. Opozycja wykorzystuje rozbieżność do zarzutów o paraliż decyzyjny rządu.
                </p>
                <div className="mt-3 text-xs bg-slate-900 print:bg-neutral-200 p-2.5 rounded font-mono text-slate-300 print:text-black">
                  <span className="font-bold text-amber-400 print:text-black">Rekomendacja KPRM:</span> Skierowanie projektu na Stały Komitet Rady Ministrów z zakazem wypowiedzi medialnych dla wiceministrów obu resortów do czasu uzgodnienia kompromisu.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Morning Broadcast Audits */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 print:text-black font-bold mb-2">
              3. Poranne rozmowy radiowo-telewizyjne (godz. 7:00–9:30)
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-800 print:border-neutral-300">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 print:bg-neutral-100 font-mono text-slate-400 print:text-black border-b border-slate-800 print:border-neutral-300">
                  <tr>
                    <th className="py-2.5 px-3">Polityk / Resort</th>
                    <th className="py-2.5 px-3">Stacja</th>
                    <th className="py-2.5 px-3">Główna teza</th>
                    <th className="py-2.5 px-3 text-right">Ocena spójności</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-neutral-300 text-slate-300 print:text-black">
                  <tr>
                    <td className="py-2 px-3 font-semibold">Cezary Tomczyk (MON)</td>
                    <td className="py-2 px-3">Radio ZET</td>
                    <td className="py-2 px-3">Spójne z KPRM: pełna realizacja kontraktów zbrojeniowych i Tarczy Wschód.</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-400 print:text-black font-bold">100% Zgodne</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Krzysztof Paszyk (MRiT)</td>
                    <td className="py-2 px-3">RMF FM</td>
                    <td className="py-2 px-3">Nacisk na natychmiastowe obniżenie składki zdrowotnej bez zgody MF.</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-400 print:text-black font-bold">Rozdźwięk P1</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Adam Bodnar (MS)</td>
                    <td className="py-2 px-3">TVN24</td>
                    <td className="py-2 px-3">Informacja o harmonogramie ustaw praworządnościowych i uzgodnieniach z KE.</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-400 print:text-black font-bold">100% Zgodne</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: European Dimension */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 print:text-black font-bold mb-2">
              4. Wymiar europejski i przygotowania do Rady UE
            </h2>
            <div className="p-4 rounded-xl bg-slate-950/80 print:bg-neutral-50 border border-slate-800 print:border-neutral-300 text-xs text-slate-300 print:text-black leading-relaxed space-y-2">
              <p>
                <strong>Procedura nadmiernego deficytu:</strong> Minister ds. UE Adam Szłapka oraz MF sfinalizowali założenia planu strukturalno-budżetowego. Ryzyko uwag KE oceniono na niskie pod warunkiem utrzymania dyscypliny wydatkowej.
              </p>
              <p>
                <strong>KPO:</strong> Złożenie czwartego i piątego wniosku o płatność przebiega zgodnie z harmonogramem. Brak kolizji z kamieniami milowymi.
              </p>
            </div>
          </div>

          {/* Section 5: Morning Briefing Directives */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 print:text-black font-bold mb-2">
              5. Rekomendowane dyspozycje na poranną odprawę KPRM (godz. 8:30)
            </h2>
            <div className="p-4 rounded-xl bg-slate-950/90 print:bg-neutral-50 border border-slate-800 print:border-neutral-300 text-xs space-y-2 text-slate-200 print:text-black font-mono">
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 print:text-black font-bold">1.</span>
                <span>CIR wydaje komunikat porządkujący stanowisko rządu w sprawie składki zdrowotnej: wspólny projekt MF i MRiT zostanie przedstawiony po uzgodnieniach międzyresortowych.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 print:text-black font-bold">2.</span>
                <span>Przypomnienie ministrom konstytucyjnym o zakazie zapowiadania nowych obciążeń fiskalnych bez uprzedniej kontrasygnaty ministra finansów.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 print:text-black font-bold">3.</span>
                <span>Wystąpienie premiera Donalda Tuska na konferencji prasowej po posiedzeniu rządu: akcent na bezpieczeństwo, stabilność koalicji i inwestycje strategiczne.</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-800 print:border-black flex justify-between items-end text-xs font-mono text-slate-400 print:text-neutral-700">
            <div>
              <div>Sporządził: Departament Komunikacji Rządowej KPRM</div>
              <div>System: GOVscope v2.4 (Silnik Spójności Rządowej)</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-200 print:text-black">Zatwierdził do przedłożenia:</div>
              <div>Szef Gabinetu Politycznego Premiera</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
