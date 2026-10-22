import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'GOVscope — System Monitoringu, Wczesnego Ostrzegania i Spójności Rządowej dla KPRM',
  description:
    'Rządowy radar ryzyka narracyjnego, spójności koalicyjnej i wczesnego ostrzegania dedykowany Kancelarii Prezesa Rady Ministrów oraz ministrowi ds. Unii Europejskiej.',
  icons: {
    icon: '/govscope-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-[#07111f] text-slate-100 antialiased selection:bg-amber-300 selection:text-slate-950">
        <Header />
        <main className="mx-auto max-w-[1440px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
