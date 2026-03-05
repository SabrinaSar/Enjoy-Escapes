"use client";

import Link from "next/link";
import { BarChart, Home, PackagePlus, Menu, X, Image, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/db/providers/toast-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when screen resizes to larger than mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 flex bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar trigger */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 shadow-md"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-200 ease-in-out 
          md:static md:translate-x-0 flex flex-col flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Admin Dashboard
          </h2>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="h-4 w-4" />
            Admin Home
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart className="h-4 w-4" />
            Escape Analytics
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <Image className="h-4 w-4" />
            Banner Management
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <PackagePlus className="h-4 w-4" />
            Category Management
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <PackagePlus className="h-4 w-4" />
            Blog Management
          </Link>
          <Link
            href="/admin/blog/gallery"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <Image className="h-4 w-4" />
            Image Gallery
          </Link>
          <Link
            href="/admin/newsletter"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <Mail className="h-4 w-4" />
           Edit Newsletter
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full pl-0 pt-0">
        <ToastProvider />
        <main className="bg-gray-100 dark:bg-gray-900 p-4">{children}</main>
      </div>
    </div>
  );
}
