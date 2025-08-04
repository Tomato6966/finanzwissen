
import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import PageRouter from "./pagerouter";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageRouter>
          {children}
        </PageRouter>
      </body>
    </html>
  );
}
