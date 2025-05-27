"use client"
import Navbar from '@/app/(components)/Navbar';
import { Sidebar } from '@/app/(components)/Sidebar';
import StoreProvider, { useAppSelector } from './redux';
import { useEffect } from 'react';
type Props = {
  children: React.ReactNode;
};
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isCollapsed = useAppSelector((state: any) => {
    // console.log('state1',state)
    return state.global.isSidebarCollapsed
  });
  const isDarkMode = useAppSelector((state: any) => state.global.isDarkMode);
  // useEffect 监听isDarkMode的变化,页面一进来就执行
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);
  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
      <Sidebar />
      <main className={`flex flex-col w-full h-screen py-7  px-[20px] bg-gray-10 ${isCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>

        <Navbar isDarkMode={isDarkMode} isSidebarCollapsed={isCollapsed} />
        {children}
      </main>
    </div>
  );
};

// 导出一个名为DashboardWrapper的函数组件
export const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  // 返回一个StoreProvider组件，其中包含一个DashboardLayout组件，DashboardLayout组件中包含传入的children
  return (
    <StoreProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </StoreProvider>
  )
}
