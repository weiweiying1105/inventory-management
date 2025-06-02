
"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import '@/app/globals.css'
import { usePathname } from "next/navigation";
import 'antd/dist/reset.css';  // 如果是 Antd v5
import StoreProvider from "./redux";
import LayoutWrapper from "./components/LayoutWrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname()
  return (
    <html lang="en" >
      <body style={{
        backgroundImage: pathName === '/login' ? 'url(/login_bg.jpg)' : 'none',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeRegistry>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
