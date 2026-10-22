'use client';
import React, { useEffect, useState } from 'react';

type CommandPaletteProps = { isOpen: boolean; onClose: () => void; onOpenExecutiveBriefing?: () => void };
const routes = [['/','Radar KPRM'],['/resorty','Przegląd resortów'],['/alerty','Centrum alertów'],['/rozdzieki','Detektor rozdźwięków'],['/europa','Wymiar europejski'],['/audytor','Audytor AI'],['/wykresy','Wykresy i metryki']];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  useEffect(() => { if (!isOpen) setQuery(''); }, [isOpen]);
  if (!isOpen) return null;
  const filtered = routes.filter(([, label]) => label.toLowerCase().includes(query.toLowerCase()));
  return <div className="fixed inset-0 z-50 bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}><div className="mx-auto mt-20 max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex gap-2"><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj modułu..." className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"/><button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-3 text-xs text-slate-400">Zamknij</button></div><div className="mt-3 space-y-1">{filtered.map(([path, label]) => <button key={path} type="button" onClick={() => { onClose(); window.location.href = path; }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white">{label}</button>)}{filtered.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">Brak modułu.</p>}</div></div></div>;
};
