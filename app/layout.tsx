import "./globals.css";

import Navbar from "@/app/components/navbar";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import LayoutWrapper from "@/app/components/LayoutWrapper";

const defaultUrl = "https://enjoyescapes.com";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Enjoy Escapes - Curated Travel Experiences",
  description: "Discover unique travel escapes curated by Enjoy Escapes.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/logo.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

import { ToastProvider } from "@/db/providers/toast-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ToastProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            <Navbar />
            <div className="w-full flex-1 flex flex-col">{children}</div>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
