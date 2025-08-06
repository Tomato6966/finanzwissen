
import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageRouter from "@/Context/PageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const domain = process.env.NEXT_PUBLIC_DOMAIN + (process.env.NEXT_PUBLIC_BASE_PATH || '');

export const metadata: Metadata = {
  title: "FinanzWissen",
  description: "FinanzWissen by Finanzfluss Community (not affiliated with Finanzfluss.de) - Lerne alles über finanzielle Bildung, Investieren und Geldmanagement. Nutze Rechner, Tools und mehr.",
  keywords: ["finanzielle bildung", "finanzwissen", "finanzfluss", "geld", "investieren"],
  authors: [{ name: "Finanzfluss Community" }],
  creator: "Finanzfluss Community",
  publisher: "Finanzfluss Community",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(domain),
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: domain,
    siteName: "FinanzWissen",
    title: "FinanzWissen - Finanzielle Bildung",
    description: "FinanzWissen by Finanzfluss Community (not affiliated with Finanzfluss.de) - Lerne alles über finanzielle Bildung, Investieren und Geldmanagement. Nutze Rechner, Tools und mehr.",
    images: [
      {
        url: `${domain}/images/finanzwissen_community.png`,
        width: 500,
        height: 500,
        alt: "FinanzWissen Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: domain,
    creator: "@finanzfluss_community @chrissy8282",
    title: "FinanzWissen - Finanzielle Bildung",
    description: "FinanzWissen by Finanzfluss Community (not affiliated with Finanzfluss.de) - Lerne alles über finanzielle Bildung, Investieren und Geldmanagement. Nutze Rechner, Tools und mehr.",
    images: [`${domain}/images/finanzwissen_community.png`],
  },
  other: {
    "theme-color": "#4c69d9",
    "msapplication-TileColor": "#4c69d9",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FinanzWissen",
    "application-name": "FinanzWissen",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: PropsWithChildren) {
  return (
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageRouter>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
        </PageRouter>
      </body>
    </html>
  );
}
