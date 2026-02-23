import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Across the Seas Stories',
    template: '%s | Across the Seas Stories',
  },
  description:
    'Bedtime stories that keep families close, no matter the distance. Voice-recorded tales from the people who love your little ones most.',
  applicationName: 'Across the Seas Stories',
  keywords: [
    'bedtime stories',
    'family stories',
    'grandparent stories',
    'toddler bedtime',
    'voice recorded stories',
    'across the seas',
  ],
  openGraph: {
    type: 'website',
    title: 'Across the Seas Stories',
    description:
      'Bedtime stories that keep families close, no matter the distance.',
    siteName: 'Across the Seas Stories',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Across the Seas Stories — a sailboat crossing the ocean toward a glowing village under a trail of stars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Across the Seas Stories',
    description:
      'Bedtime stories that keep families close, no matter the distance.',
    images: ['/images/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#172554',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
