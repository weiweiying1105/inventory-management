'use client';
// 有任何交互的话需要加use client
import React from 'react';
import { Menu, Search, Bell, Sun, Settings,Moon } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/app/state';
const Navbar = ({isDarkMode,isSidebarCollapsed}: {isDarkMode: boolean,isSidebarCollapsed: boolean} ) => {
const dispatch = useAppDispatch()
const toggleSidebar = () => {
  dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
}

  return (
    <div className="flex justify-between items-center w-full mb-7">{/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
          title="Menu"
        >
          <Menu className="w-4 h-4"  />
        </button>
        <div className="relative">
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="inset-y-0 pl-3 flex absolute items-center pointer-events-none left-3  text-gray-400">
            <Search size={16} />
          </div>
        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <div className="hidden md:flex items-center gap-5">
          <div>
            <button onClick={() => { 
              dispatch(setIsDarkMode(!isDarkMode));
            }} >
              {
                isDarkMode ? (
                  <Sun size={24} className="cursor-pointer text-gray-500" />
                ) : (
                  <Moon size={24} className="cursor-pointer text-gray-500" />
                )
              }
              
            </button>
          </div>
          <div className="relative">
            <Bell size={24} className='cursor-pointer text-gray-500' />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full ">1</span>
          </div>
          <hr className="w-0 h-7 border-solid border-gray-300 border-l mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gray-100">

            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
        </div>
        <Link href="/settings">
          <Settings className='cursor-pointer text-gray-500 ' size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

