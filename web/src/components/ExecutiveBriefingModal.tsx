'use client';
import React, { useEffect } from 'react';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';

type ExecutiveBriefingModalProps = { isOpen: boolean; onClose: () => void };

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => { if (!isOpen) return; const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 p-4 sm:p-8"><div className="mx-auto flex min-h-full max-w-5xl items-center"><div className="w-full"><div className="mb-4 flex justify-end"><button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white">Zamknij</button></div><VerifiedDataEmptyState title="Brak danych do odprawy gabinetowej" description="Tryb gabinetowy nie generuje raportu z przykładowych liczb, scenariuszy ani ręcznie wpisanych tez. Zostanie udostępniony po zasileniu i weryfikacji źródeł." source="oficjalne rejestry GOVscope" /></div></div></div>;
};
