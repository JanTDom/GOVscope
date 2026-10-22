import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../components/MetricCard';
import { ConflictCard } from '../components/ConflictCard';
import { NarrativeConflictItem } from '../types';

describe('GOVscope Operational Frontend', () => {
  it('renders MetricCard with proper values', () => {
    render(
      <MetricCard
        label="Indeks spójności rządu"
        value="Brak danych"
        subtext="Brak zweryfikowanej podstawy"
        trend="neutral"
      />
    );

    expect(screen.getByText('Indeks spójności rządu')).toBeDefined();
    expect(screen.getByText('Brak danych')).toBeDefined();
    expect(screen.getByText('Brak zweryfikowanej podstawy')).toBeDefined();
  });

  it('renders ConflictCard with P1_CRITICAL status and quotation clash', () => {
    const fixtureConflict: NarrativeConflictItem = {
      id: 'test-conf-1',
      conflictType: 'NAPIĘCIE_KOALICYJNE',
      severity: 'P1_CRITICAL',
      title: 'Spór o składkę zdrowotną',
      summary: 'Rozbieżność między resortami koalicji.',
      topic: 'Składka zdrowotna',
      detectedAt: '2026-10-21T18:00:00Z',
      resolutionStatus: 'DETECTED',
      statements: [
        {
          id: 's1',
          officialName: 'Minister A',
          roleTitle: 'Minister',
          ministryCode: 'MF',
          coalitionParty: 'KO',
          quote: 'Brak środków na dalsze cięcia.',
          source: 'Radio',
          publishedAt: '2026-10-21T08:00:00Z',
        },
        {
          id: 's2',
          officialName: 'Minister B',
          roleTitle: 'Minister',
          ministryCode: 'MRiT',
          coalitionParty: 'PSL',
          quote: 'Obniżka jest wymogiem koalicyjnym.',
          source: 'Konferencja',
          publishedAt: '2026-10-21T09:00:00Z',
        },
      ],
      recommendedAction: 'Pilne spotkanie w KPRM.',
    };

    render(<ConflictCard conflict={fixtureConflict} />);
    expect(screen.getByText('Spór o składkę zdrowotną')).toBeDefined();
    expect(screen.getByText('P1 CRITICAL')).toBeDefined();
    expect(screen.getByText(/Brak środków na dalsze cięcia/)).toBeDefined();
    expect(screen.getByText(/Obniżka jest wymogiem koalicyjnym/)).toBeDefined();
    expect(screen.getByText('Pilne spotkanie w KPRM.')).toBeDefined();
  });
});
