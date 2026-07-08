import type { Metadata } from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { createClientServer } from '@/lib/supabase';
import { mapSiteSettings } from '@/lib/adapters';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClientServer();
    const { data: dbSettings } = await supabase.from('site_settings').select('*').maybeSingle();
    const settings = mapSiteSettings(dbSettings);
    
    return {
      title: settings.seoTitle || 'Pharmaceutical Enterprise - WHO-GMP & Regulatory Aligned Quality',
      description: settings.seoDesc || 'Pioneering pharmaceutical formulation, high-purity APIs, and sterile injectables for global markets.',
    };
  } catch (error) {
    return {
      title: 'Pharmaceutical Enterprise - WHO-GMP & Regulatory Aligned Quality',
      description: 'Pioneering pharmaceutical formulation, high-purity APIs, and sterile injectables for global markets.',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-slate-950 text-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
