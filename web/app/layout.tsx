import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import TrialBanner from '@/components/TrialBanner';

export const metadata: Metadata = {
  title: 'صحّتي | SIHATI - المنصة الرقمية الصحية الوطنية',
  description:
    'منصة صحية رقمية موحدة تربط بين الأطباء والمرضى، تدمج الملف الطبي الموحد، زر الطوارئ، والنظام الوطني للأدوية 2025.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="/fonts/cairo.css" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <LanguageProvider>
            {/* Bandeau de Période d'Évaluation 15 Jours & Blocage Expiration */}
            <TrialBanner />

            {/* Navigation Bar Dynamique Multilingue (AR / FR / EN) */}
            <Navbar />

            {/* Contenu Principal */}
            <main className="flex-1">{children}</main>

            {/* Footer Multilingue */}
            <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>
                  © 2026 <strong>مشروع ستارتاب صحّتي (SIHATI)</strong> • République Algérienne Démocratique et Populaire • Wilaya de Sétif.
                </p>
                <div className="flex items-center gap-6 text-[11px]">
                  <span className="text-emerald-700 font-bold">✓ 560 Médicaments 2025</span>
                  <span>57 Analyses Biologiques</span>
                  <span>40 Examens d'Imagerie</span>
                  <span className="text-slate-400">Loi 18-07</span>
                </div>
              </div>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
