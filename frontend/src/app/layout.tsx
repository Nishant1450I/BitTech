import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Dead Infrastructure Mapper | The Reality Map of Public Infrastructure',
  description:
    'Map and audit broken, damaged, and inaccessible public infrastructure. See what actually works versus what official records claim.',
  keywords: [
    'civic tech',
    'infrastructure mapping',
    'broken streetlights',
    'wheelchair accessibility',
    'reality map',
    'smart city audit',
  ],
  authors: [{ name: 'Dead Infrastructure Mapper Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-rose-500/20 selection:text-rose-600">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
