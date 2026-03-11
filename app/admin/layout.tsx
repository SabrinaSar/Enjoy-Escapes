"use client";

import Link from "next/link";
import {
  BarChart,
  Home,
  PackagePlus,
  Menu,
  X,
  Image,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/db/providers/toast-provider";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close sidebar when screen resizes to larger than mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { href: "/admin", label: "Admin Home", icon: Home },
    { href: "/admin/analytics", label: "Escape Analytics", icon: BarChart },
    { href: "/admin/banners", label: "Banner Management", icon: Image },
    { href: "/admin/categories", label: "Category Management", icon: PackagePlus },
    { href: "/admin/blog", label: "Blog Management", icon: PackagePlus },
    { href: "/admin/blog/gallery", label: "Image Gallery", icon: Image },
    { href: "/admin/newsletter", label: "Edit Newsletter", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <ToastProvider />
      
      {/* Mobile sidebar trigger */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 shadow-xl border-primary/20"
        >
          {sidebarOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out
          md:sticky md:top-0 md:h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "w-64"}
        `}
      >
        <div className="h-full flex flex-col relative">
          {/* Collapse toggle desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-7 z-50 bg-primary text-white rounded-full p-1 shadow-lg border-2 border-white dark:border-gray-800 hover:scale-110 transition-transform"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Header */}
          <div className={`p-6 border-b dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent truncate">
                Admin Panel
              </h2>
            )}
            <button
              className="md:hidden text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            {isCollapsed && <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden pt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/30" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"}
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                  {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="fixed left-20 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap ml-2">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer of Sidebar */}
          <div className="p-4 border-t dark:border-gray-700">
            <Link 
              href="/" 
              className={`flex items-center gap-2 group ${isCollapsed ? 'justify-center' : ''}`}
            >
               <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <Home size={16} />
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">View Site</span>
                   <span className="text-[10px] text-gray-500">Go back to home</span>
                 </div>
               )}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
  

        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
            {children}
        
        </main>
      </div>
    </div>
  );
}
