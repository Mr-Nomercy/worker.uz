import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LocaleProvider } from "@/components/LocaleProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Worker.uz - O\'zbekistonning rasmiy ish platformasi',
    template: '%s | Worker.uz',
  },
  description: 'Davlat integratsiyali rasmiy ish platformasi. Ish izlovchilar va ish beruvchilar uchun eng yaxshi imkoniyatlar.',
  keywords: ['ish', 'vakansiya', 'qidiruv', 'ish beruvchi', 'nomzod', 'uzbekistan', 'employment'],
  authors: [{ name: 'Worker.uz' }],
  creator: 'Worker.uz',
  publisher: 'Worker.uz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://worker.uz',
    siteName: 'Worker.uz',
    title: 'Worker.uz - O\'zbekistonning rasmiy ish platformasi',
    description: 'Davlat integratsiyali rasmiy ish platformasi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Worker.uz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Worker.uz - O\'zbekistonning rasmiy ish platformasi',
    description: 'Davlat integratsiyali rasmiy ish platformasi',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <LocaleProvider>
          <Providers>{children}</Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
