
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import '@/app/globals.css'
import LayoutWrapper from './components/LayoutWrapper';
import 'antd/dist/reset.css';  // 如果是 Antd v5
// 或者
import 'antd/dist/antd.css';   // 如果是 Antd v4

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
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
