import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExecutiveBriefingModal } from '../components/ExecutiveBriefingModal';
import { CommandPalette } from '../components/CommandPalette';
import { MobileExecutiveDock } from '../components/MobileExecutiveDock';
import ResortyPage from '../app/resorty/page';
import PremierPulpitPage from '../app/premier/page';

describe('Executive Briefing & Command Palette Modules', () => {
  it('renders ExecutiveBriefingModal with key priorities and prime minister riposte', () => {
    const handleClose = vi.fn();
    render(<ExecutiveBriefingModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Poranna odprawa strategiczna Prezesa Rady Ministrów/)).toBeDefined();
    expect(screen.getByText(/Składka zdrowotna \(MF vs PSL\)/)).toBeDefined();
    expect(screen.getByText(/Tarcza Wschód i granica/)).toBeDefined();
    expect(screen.getByText(/Większość rządowa w Sejmie X kadencji/)).toBeDefined();
    expect(screen.getByText(/Obowiązująca riposta Donalda Tuska do kamer/)).toBeDefined();
    expect(screen.getByText(/Drukuj teczkę A4/)).toBeDefined();

    // Trigger close via button
    fireEvent.click(screen.getByText(/Zamknij \[Esc\]/));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders CommandPalette and filters items based on query', () => {
    const handleClose = vi.fn();
    render(<CommandPalette isOpen={true} onClose={handleClose} />);

    expect(screen.getByPlaceholderText(/Szukaj polityka, resortu, tematu sporu/)).toBeDefined();
    expect(screen.getByText('Donald Tusk')).toBeDefined();
    expect(screen.getByText('Andrzej Domański')).toBeDefined();

    // Search for a specific policy or politician
    const searchInput = screen.getByPlaceholderText(/Szukaj polityka, resortu, tematu sporu/);
    fireEvent.change(searchInput, { target: { value: 'składk' } });

    expect(screen.getByText('Składka zdrowotna dla przedsiębiorców')).toBeDefined();
    expect(screen.getByText('Projekt UD124: Obniżenie składki zdrowotnej')).toBeDefined();
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
    expect(screen.getByText(/67%/)).toBeDefined();
    expect(screen.getAllByText(/Ryzyko weta prezydenckiego \/ TK/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/RYZYKO: KRYTYCZNE/i).length).toBeGreaterThan(0);
  });

  it('renders PremierPulpitPage with presidential veto radar and session decision log', () => {
    render(<PremierPulpitPage />);

    expect(screen.getByText(/Pulpit Prezesa Rady Ministrów/)).toBeDefined();
    expect(screen.getByText(/Wskaźnik ryzyka weta prezydenckiego i wniosków do TK/i)).toBeDefined();
    expect(screen.getByText(/Dziennik podjętych dyspozycji gabinetu/i)).toBeDefined();
    expect(screen.getByText(/Centrum Informacyjne Rządu \(CIR\)/)).toBeDefined();
    expect(screen.getByText(/Stały Komitet Rady Ministrów \(SKRM\)/)).toBeDefined();
  });
});
