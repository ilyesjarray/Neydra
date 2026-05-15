import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { RoyalWallpaper } from '@/components/ui/RoyalWallpaper';
import { NeydraTerminal } from '@/components/ui/NeydraTerminal';
import { NeydraSecurity } from '@/components/system/NeydraSecurity';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'NEYDRA | Where Imagination Becomes Reality',
  description: 'NEYDRA - Where Imagination Becomes Reality',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/icon.png',
  },
  openGraph: {
    title: 'NEYDRA | Where Imagination Becomes Reality',
    description: 'NEYDRA - Where Imagination Becomes Reality',
    url: 'neydra.vercel.app',
    siteName: 'NEYDRA',
    images: [
      {
        url: 'https://raw.githubusercontent.com/ilyesjarray/Neydra-assets/main/og-image2.jpg',
        secureUrl: 'https://raw.githubusercontent.com/ilyesjarray/Neydra-assets/main/og-image2.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEYDRA | Where Imagination Becomes Reality',
    description: 'NEYDRA - Where Imagination Becomes Reality',
    images: ['https://raw.githubusercontent.com/ilyesjarray/Neydra-assets/main/og-image2.jpg'],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/intro.mp4" as="video" type="video/mp4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased text-neydra-blue bg-black`}
      >
        <Providers>
          <NeydraSecurity />
          <RoyalWallpaper />
          <NeydraTerminal />
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
