import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedSure — Smart Medicine Safety & Multilingual Explanation',
  description: 'Instant AI vision medicine pack safety checks, plain-language component breakdown, allergy alerts, and verified pharmacist guardrails for Nigerian families.',
  keywords: ['MedSure', 'NAFDAC', 'Nigeria Healthcare', 'Medicine Safety', 'Drug Interaction Checker', 'Pidgin', 'Yoruba', 'Hausa', 'Igbo'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="antialiased bg-[#0b1120] text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Ambient lighting glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[130px]" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
