import Link from "next/link";
import { BarChart, Home, PackagePlus } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col flex-shrink-0">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Admin Dashboard
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <Home className="h-4 w-4" />
            Admin Home
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <BarChart className="h-4 w-4" />
            Escape Analytics
          </Link>
          {/* Add other admin links here */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <main className="bg-gray-100 dark:bg-gray-900 p-6">{children}</main>
      </div>
    </div>
  );
}
