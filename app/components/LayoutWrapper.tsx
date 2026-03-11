"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import NewsletterPopup from "@/components/newsletter-popup";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">
        {children}
        {!isAdmin && <Footer />}
      </div>
      {!isAdmin && <NewsletterPopup showTrigger={false} />}
    </main>
  );
}
