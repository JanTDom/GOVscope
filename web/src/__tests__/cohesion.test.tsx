import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../components/MetricCard';
import { ConflictCard } from '../components/ConflictCard';
import { OFFICIAL_MINISTRIES } from '../lib/constants';
import { NarrativeConflictItem } from '../types';

describe('GOVscope Operational Frontend', () => {
  it('covers all 22 Polish ministries and central bodies with coalition mapping', () => {
    expect(OFFICIAL_MINISTRIES.length).toBe(22);
    const codes = OFFICIAL_MINISTRIES.map((m) => m.code);
    expect(codes).toContain('KPRM');
    expect(codes).toContain('MF');
    expect(codes).toContain('MSZ');
    expect(codes).toContain('MON');
    expect(codes).toContain('MSWiA');
    expect(codes).toContain('MS');
    expect(codes).toContain('MAP');
    expect(codes).toContain('MRiT');
    expect(codes).toContain('MKiŚ');
    expect(codes).toContain('MRPiPS');
    expect(codes).toContain('MZ');
    expect(codes).toContain('MEN');
    expect(codes).toContain('M_UE');
  });

  it('renders MetricCard with proper values', () => {
    render(
      <MetricCard
        label="Indeks spójności rządu"
        value="89.4%"
        subtext="-1.2 pkt w ciągu 24h"
        trend="positive"
      />
    );

    expect(screen.getByText('Indeks spójności rządu')).toBeDefined();
    expect(screen.getByText('89.4%')).toBeDefined();
    expect(screen.getByText('-1.2 pkt w ciągu 24h')).toBeDefined();
  });

  it('renders ConflictCard with P1_CRITICAL status and quotation clash', () => {
    const mockConflict: NarrativeConflictItem = {
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

    render(<ConflictCard conflict={mockConflict} />);
    expect(screen.getByText('Spór o składkę zdrowotną')).toBeDefined();
    expect(screen.getByText('P1 CRITICAL')).toBeDefined();
    expect(screen.getByText(/Brak środków na dalsze cięcia/)).toBeDefined();
    expect(screen.getByText(/Obniżka jest wymogiem koalicyjnym/)).toBeDefined();
    expect(screen.getByText('Pilne spotkanie w KPRM.')).toBeDefined();
  });
});
