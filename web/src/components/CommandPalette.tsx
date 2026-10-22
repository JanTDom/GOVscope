'use client';

import React, { useState, useEffect, useMemo } from 'react';

export interface CommandItem {
  id: string;
  category: 'Osoby' | 'Tematy sporu' | 'Legislacja RCL' | 'Pulpity i akcje';
  title: string;
  subtitle: string;
  badge?: string;
  badgeClass?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExecutiveBriefing?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenExecutiveBriefing,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = (path: string) => {
    onClose();
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const items: CommandItem[] = useMemo(() => [
    // Pulpity i akcje
    {
      id: 'act-briefing',
      category: 'Pulpity i akcje',
      title: 'Uruchom tryb gabinetowy Premiera (Executive Briefing)',
      subtitle: 'Minimalistyczny widok pełnoekranowy na tablet i rzutnik KPRM',
      badge: 'SKRÓT B',
      badgeClass: 'bg-amber-950 text-amber-300 border-amber-800',
      action: () => {
        onClose();
        if (onOpenExecutiveBriefing) onOpenExecutiveBriefing();
      },
    },
    {
      id: 'act-print',
      category: 'Pulpity i akcje',
      title: 'Drukuj oficjalny briefing gabinetowy A4',
      subtitle: 'Generuje sformatowany arkusz z nagłówkiem KPRM i klauzulą Zastrzeżone',
      badge: 'DRUK A4',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      action: () => {
        onClose();
        if (typeof window !== 'undefined') window.print();
      },
    },
    {
      id: 'act-premier',
      category: 'Pulpity i akcje',
      title: 'Przejdź do: Pulpit Premiera (Prezes Rady Ministrów)',
      subtitle: 'Poranna odprawa, riposty na trudne pytania dziennikarzy i wektory opozycji',
      badge: 'PREMIER',
      badgeClass: 'bg-amber-950 text-amber-400 border-amber-800',
      action: () => navigate('/premier'),
    },
    {
      id: 'act-koalicja',
      category: 'Pulpity i akcje',
      title: 'Przejdź do: Pulpit Komitetu Politycznego Koalicji',
      subtitle: 'Kalkulator dyscypliny sejmowej i bilans 247 posłów',
      badge: 'SEJM',
      badgeClass: 'bg-blue-950 text-blue-400 border-blue-800',
      action: () => navigate('/koalicja'),
    },
    {
      id: 'act-rzecznik',
      category: 'Pulpity i akcje',
      title: 'Przejdź do: Pulpit Rzecznika Prasowego Rządu (CIR)',
      subtitle: 'Dyspozycje medialne, formatki Signal/SMS do rzeczników ministerstw',
      badge: 'CIR',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      action: () => navigate('/rzecznik'),
    },
    {
      id: 'act-szef-kprm',
      category: 'Pulpity i akcje',
      title: 'Przejdź do: Pulpit Szefa KPRM (Jan Grabiec)',
      subtitle: 'Porządek Stałego Komitetu RM, blokady ustawowe i weryfikacja OSR',
      badge: 'SKRM',
      badgeClass: 'bg-purple-950 text-purple-400 border-purple-800',
      action: () => navigate('/szef-kprm'),
    },
    {
      id: 'act-wykresy',
      category: 'Pulpity i akcje',
      title: 'Przejdź do: Centrum Wykresów i Metryk KPRM',
      subtitle: '32 specjalistyczne wykresy telemetryczne spójności rządu, dyscypliny resortów i mediów',
      badge: 'WYKRESY',
      badgeClass: 'bg-amber-950 text-amber-400 border-amber-800',
      action: () => navigate('/wykresy'),
    },

    // Osoby
    {
      id: 'pol-donald-tusk',
      category: 'Osoby',
      title: 'Donald Tusk',
      subtitle: 'Prezes Rady Ministrów • Przewodniczący Koalicji Obywatelskiej',
      badge: 'KPRM / KO',
      badgeClass: 'bg-orange-950 text-orange-400 border-orange-800',
      action: () => navigate('/premier'),
    },
    {
      id: 'pol-kosiniak-kamysz',
      category: 'Osoby',
      title: 'Władysław Kosiniak-Kamysz',
      subtitle: 'Wiceprezes RM, Minister Obrony Narodowej • Prezes PSL',
      badge: 'MON / PSL',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      action: () => navigate('/koalicja'),
    },
    {
      id: 'pol-gawkowski',
      category: 'Osoby',
      title: 'Krzysztof Gawkowski',
      subtitle: 'Wiceprezes RM, Minister Cyfryzacji • Nowa Lewica',
      badge: 'MC / NL',
      badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
      action: () => navigate('/resorty'),
    },
    {
      id: 'pol-domanski',
      category: 'Osoby',
      title: 'Andrzej Domański',
      subtitle: 'Minister Finansów • Koalicja Obywatelska (spory fiskalne, składka zdrowotna)',
      badge: 'MF / KO',
      badgeClass: 'bg-orange-950 text-orange-400 border-orange-800',
      action: () => navigate('/rozdzieki'),
    },
    {
      id: 'pol-paszyk',
      category: 'Osoby',
      title: 'Krzysztof Paszyk',
      subtitle: 'Minister Rozwoju i Technologii • PSL (kredyt mieszkaniowy, składka przedsiębiorców)',
      badge: 'MRiT / PSL',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      action: () => navigate('/rozdzieki'),
    },
    {
      id: 'pol-pelczynska-nalecz',
      category: 'Osoby',
      title: 'Katarzyna Pełczyńska-Nałęcz',
      subtitle: 'Minister Funduszy i Polityki Regionalnej • Polska 2050 (KPO, sprzeciw wobec dopłat do deweloperów)',
      badge: 'MFiPR / PL2050',
      badgeClass: 'bg-yellow-950 text-yellow-400 border-yellow-800',
      action: () => navigate('/rozdzieki'),
    },
    {
      id: 'pol-sikorski',
      category: 'Osoby',
      title: 'Radosław Sikorski',
      subtitle: 'Minister Spraw Zagranicznych • Koalicja Obywatelska',
      badge: 'MSZ / KO',
      badgeClass: 'bg-orange-950 text-orange-400 border-orange-800',
      action: () => navigate('/europa'),
    },
    {
      id: 'pol-szlapka',
      category: 'Osoby',
      title: 'Radosław Sikorski',
      subtitle: 'Minister ds. Unii Europejskiej • Koalicja Obywatelska (naruszenia, prezydencja)',
      badge: 'UE / KO',
      badgeClass: 'bg-blue-950 text-blue-400 border-blue-800',
      action: () => navigate('/europa'),
    },

    // Tematy sporu
    {
      id: 'top-skladka',
      category: 'Tematy sporu',
      title: 'Składka zdrowotna dla przedsiębiorców',
      subtitle: 'Rozdźwięk: MF (Domański) vs MRiT/PSL (Paszyk, Kosiniak-Kamysz) vs Lewica',
      badge: 'SPÓR P1',
      badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
      action: () => navigate('/rozdzieki'),
    },
    {
      id: 'top-kredyt',
      category: 'Tematy sporu',
      title: 'Kredyt mieszkaniowy Na Start 0%',
      subtitle: 'Rozdźwięk: MRiT (Paszyk) vs MFiPR (Pełczyńska-Nałęcz) i Lewica',
      badge: 'SPÓR P1',
      badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
      action: () => navigate('/rozdzieki'),
    },
    {
      id: 'top-cpk',
      category: 'Tematy sporu',
      title: 'Centralny Port Komunikacyjny (CPK / KDP)',
      subtitle: 'Stanowisko KPRM: Polska w 100 minut, lotnisko Baranów do 2032 r.',
      badge: 'KPRM OK',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      action: () => navigate('/premier'),
    },
    {
      id: 'top-tarcza',
      category: 'Tematy sporu',
      title: 'Tarcza Wschód i bezpieczeństwo granicy',
      subtitle: 'MON i MSWiA: 10 mld zł na fortyfikacje wschodniej granicy RP',
      badge: 'PRIORYTET',
      badgeClass: 'bg-blue-950 text-blue-400 border-blue-800',
      action: () => navigate('/rzecznik'),
    },

    // Legislacja RCL
    {
      id: 'rcl-ud124',
      category: 'Legislacja RCL',
      title: 'Projekt UD124: Obniżenie składki zdrowotnej',
      subtitle: 'Wnioskodawca: MRiT (PSL) • Status: Balon próbny bez akceptacji MF',
      badge: 'RYZYKO RCL',
      badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
      action: () => navigate('/resorty'),
    },
    {
      id: 'rcl-ud89',
      category: 'Legislacja RCL',
      title: 'Projekt UD89: Społeczne formy mieszkalnictwa',
      subtitle: 'Wnioskodawca: MFiPR / MRiT • Status: W toku uzgodnień międzyresortowych',
      badge: 'SKRM',
      badgeClass: 'bg-amber-950 text-amber-400 border-amber-800',
      action: () => navigate('/resorty'),
    },
    {
      id: 'rcl-ud15',
      category: 'Legislacja RCL',
      title: 'Projekt UD15: Tarcza Wschód i obronność granicy',
      subtitle: 'Wnioskodawca: MON / MSWiA • Status: Zgodny z expose i uzgodniony w koalicji',
      badge: 'ZATWIERDZONY',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      action: () => navigate('/resorty'),
    },
  ], [onClose, onOpenExecutiveBriefing]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/90">
          <svg
            className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="Szukaj polityka, resortu, tematu sporu, projektu RCL lub akcji..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">
              Brak wyników odpowiadających zapytaniu: &bdquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="space-y-0.5 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.subtitle}</p>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border whitespace-nowrap self-center ${
                        item.badgeClass || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center space-x-3">
            <span>&uarr;&darr; Nawiguj</span>
            <span>&crarr; Wybierz</span>
            <span>Esc Zamknij</span>
          </div>
          <span className="text-amber-400 font-bold">KPRM GOVscope Cross-Search</span>
        </div>
      </div>
    </div>
  );
};
