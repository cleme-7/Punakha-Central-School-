import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/site-nav';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-serif' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Punakha Central School', template: '%s | Punakha Central School' },
  description: 'Rankings, announcements, sports, admissions and news from Punakha Central School.',
  openGraph: { type: 'website', siteName: 'Punakha Central School' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-gray-900 antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-3">Skip to content</a>
        <SiteNav />
        <main id="main" className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="bg-brand py-6 text-center text-sm text-white">© {new Date().getFullYear()} Punakha Central School, Punakha, Bhutan</footer>
      </body>
    </html>
  );
}
