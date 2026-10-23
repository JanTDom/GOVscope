import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResortyPage from '../app/resorty/page';
import RozdziekiPage from '../app/rozdzieki/page';
import { leadershipRoleOrder } from '../lib/live-data';

describe('GOVscope Ministries & Clashes Views', () => {
  it('renders ResortyPage without errors and displays header', () => {
    render(<ResortyPage />);
    expect(screen.getByText('Katalog resortów i skład kierownictwa rządu')).toBeDefined();
    expect(screen.getByPlaceholderText('Szukaj resortu lub członka rządu...')).toBeDefined();
  });

  it('renders RozdziekiPage with an honest empty state before verified ingest', () => {
    render(<RozdziekiPage />);
    expect(screen.getByText('Detektor rozdźwięków — oś czasu i analiza zderzeń wypowiedzi')).toBeDefined();
    expect(screen.getByText(/Brak zweryfikowanych zderzeń wypowiedzi/)).toBeDefined();
  });

  it('orders ministers before secretaries and undersecretaries', () => {
    expect(leadershipRoleOrder('PREMIER', 'Prezes Rady Ministrów')).toBe(0);
    expect(leadershipRoleOrder('MINISTER', 'Minister do spraw Unii Europejskiej')).toBeLessThan(
      leadershipRoleOrder('WICEMINISTER', 'Sekretarz Stanu, Rzecznik rządu'),
    );
    expect(leadershipRoleOrder('WICEMINISTER', 'Sekretarz Stanu, Rzecznik rządu')).toBeLessThan(
      leadershipRoleOrder('WICEMINISTER', 'Podsekretarz Stanu'),
    );
    expect(leadershipRoleOrder('PREMIER', 'Prezes Rady Ministrów')).toBeLessThan(
      leadershipRoleOrder('MINISTER', 'Minister - Członek RM, Szef Kancelarii Prezesa Rady Ministrów'),
    );
    expect(leadershipRoleOrder('MINISTER', 'Minister - Członek RM, Szef Kancelarii Prezesa Rady Ministrów')).toBeLessThan(
      leadershipRoleOrder('MINISTER', 'Minister do spraw Unii Europejskiej'),
    );
    expect(leadershipRoleOrder('MINISTER', 'Minister Energii')).toBeLessThan(
      leadershipRoleOrder('WICEMINISTER', 'Sekretarz Stanu'),
    );
    expect(leadershipRoleOrder('WICEMINISTER', 'Sekretarz Stanu')).toBeLessThan(
      leadershipRoleOrder('WICEMINISTER', 'Podsekretarz Stanu'),
    );
  });
});
