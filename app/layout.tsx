
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

export const metadata: Metadata = {
  title: "FinanzWissen",
  description: "FinanzWissen by Finanzfluss Community",
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
