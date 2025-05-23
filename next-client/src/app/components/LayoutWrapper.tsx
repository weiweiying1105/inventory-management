"use client"
import { usePathname } from 'next/navigation'
import { DashboardWrapper } from "../DashboardWrapper"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return children
  }

  return <DashboardWrapper>{children}</DashboardWrapper>
}