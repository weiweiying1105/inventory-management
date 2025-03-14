"use client"
import { Menu,LucideIcon, LayoutDashboard, Package, Clipboard, Users, Settings, CircleDollarSign } from "lucide-react"
import { useAppSelector } from "@/app/redux"
import { setIsSidebarCollapsed } from "@/app/state"
import { useAppDispatch } from "@/app/redux"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
interface SideBarLink {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const links: SideBarLink[] =[
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    isCollapsed: false,
  },
  {
    label:'Inventory',
    href:'/inventory',
    icon:Package,
    isCollapsed: false,
  },
  {
    label:'Products',
    href:'/products',
    icon:Clipboard,
    isCollapsed: false,
  },
  {
    label:"Users",
    href:'/users',
    icon:Users,
    isCollapsed: false,
  },
  {
    label:"Settings",
    href:'/settings',
    icon:Settings,
    isCollapsed: false,
  },
  {
    label:'Expenses',
    href:'/expenses',
    icon:CircleDollarSign,
    isCollapsed: false,
  }
  
]

const SideBarLink =({
  href,
  icon:LucideIcon,
  label,
  isCollapsed,
}: SideBarLink)=>{

  const path = usePathname()
  const isActive = path === href ||(path==='/' &&  href ==='/dashboard')
  const linkClass = `flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10  transition-colors duration-200 
  ${isCollapsed?'justify-center py-4' : 'justify-start px-8 py-4'} 
  ${isActive ? 'bg-blue-500 text-white' : ''}`
  
    return(
    <Link href={href}>
      <div className={linkClass}>
        <LucideIcon className="w-4 h-4" />
       <span className={`${isCollapsed ? 'hidden' : ''} font-semibold`}>{label}</span>
      </div>
    </Link>
  )
}
export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state: any) => {
    // console.log('state',state)
    return state.global.isSidebarCollapsed
  });
  // console.log('isSidebarCollapsed',isSidebarCollapsed)
  const sidebarClassName = `fixed flex flex-col ${
    isSidebarCollapsed ? 'w-0 md:w-16' : 'w-72 md:w-64'
  } bg-white transition-all duration-300 overflow-hidden h-full  shadow-md  z-40`
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  }

  return (
    <div className={sidebarClassName}>
      <div className={`flex gap-3 md:justify-normal items-center pt-8 ${isSidebarCollapsed ? 'md: justify-center' : 'justify-between '}`}>
        <div>logo</div>
        <h1 className={`font-extrabold text-2xl ${isSidebarCollapsed ? 'hidden' : ''}`}>EDSTOCk</h1>
        <button onClick={toggleSidebar} className={`${isSidebarCollapsed ? 'hidden' : ''} p-3 bg-gray-100 rounded-full hover:bg-gray-100`}>  
        <Menu size={24} className="w-4 h-4" />
      </button>
      </div>
    


      <div className="flex-grow mt-8">
        {links.map((link)=>(
          <SideBarLink key={link.href} {...link} isCollapsed={isSidebarCollapsed} />
        ))}
      </div>
      <div className={`${isSidebarCollapsed ? 'hidden' : ''} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          Copyright © 2025 EDSTOCK
        </p>
      </div>
    </div>
  )
}