import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExecutiveBriefingModal } from '../components/ExecutiveBriefingModal';
import { CommandPalette } from '../components/CommandPalette';
import { MobileExecutiveDock } from '../components/MobileExecutiveDock';
import ResortyPage from '../app/resorty/page';
import PremierPulpitPage from '../app/premier/page';

describe('Executive Briefing & Command Palette Modules', () => {
  it('renders ExecutiveBriefingModal with a verified-data empty state', () => {
    const handleClose = vi.fn();
    render(<ExecutiveBriefingModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Brak danych do odprawy gabinetowej/)).toBeDefined();

    // Trigger close via button
    fireEvent.click(screen.getByText('Zamknij'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders CommandPalette and filters items based on query', () => {
    const handleClose = vi.fn();
    render(<CommandPalette isOpen={true} onClose={handleClose} />);

    expect(screen.getByPlaceholderText(/Szukaj modułu/)).toBeDefined();
    expect(screen.getByText('Radar KPRM')).toBeDefined();
    expect(screen.getByText('Przegląd resortów')).toBeDefined();

    // Search for a specific policy or politician
    const searchInput = screen.getByPlaceholderText(/Szukaj modułu/);
    fireEvent.change(searchInput, { target: { value: 'alert' } });

    expect(screen.getByText('Centrum alertów')).toBeDefined();
  });

  it('renders MobileExecutiveDock for tablet/iPad and triggers actions', () => {
    const handleBriefing = vi.fn();
    const handleSearch = vi.fn();
    render(
      <MobileExecutiveDock
        onOpenBriefing={handleBriefing}
        onOpenSearch={handleSearch}
      />
    );

    const briefingBtn = screen.getByText('Odprawa');
    fireEvent.click(briefingBtn);
    expect(handleBriefing).toHaveBeenCalled();

    const searchBtn = screen.getByText('Szukaj');
    fireEvent.click(searchBtn);
    expect(handleSearch).toHaveBeenCalled();

    expect(screen.getByText('CIR')).toBeDefined();
    expect(screen.getByText('A4')).toBeDefined();
  });

  it('renders ResortyPage with RCL discipline and presidential veto risk assessment', () => {
    render(<ResortyPage />);

    // Switch to RCL tab
    const rclTabButton = screen.getByText('Dyscyplina RCL');
    fireEvent.click(rclTabButton);

    expect(screen.getByText('Dyscyplina legislacyjna i wykaz prac rządu (RCL)')).toBeDefined();
    expect(screen.getByText('Wskaźnik dyscypliny RCL')).toBeDefined();
    expect(screen.getByText(/Brak danych/)).toBeDefined();
    expect(screen.getByText(/Brak zweryfikowanych projektów z RCL/)).toBeDefined();
  });

  it('renders PremierPulpitPage with a verified-data empty state', () => {
    render(<PremierPulpitPage />);

    expect(screen.getByText(/Pulpit Prezesa Rady Ministrów/)).toBeDefined();
    expect(screen.getByText(/Brak zweryfikowanego meldunku dla premiera/)).toBeDefined();
  });
});
