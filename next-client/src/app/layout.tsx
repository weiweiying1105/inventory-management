import { Inter } from 'next/font/google'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardWrapper } from "./DashboardWrapper";
import ThemeRegistry from './ThemeRegistry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InventoryManagement",
  description: "InventoryManagement website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeRegistry>
          <DashboardWrapper>{children}</DashboardWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
