import "./globals.css";

import Navbar from "@/app/components/navbar";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import Footer from "@/components/footer";
import NewsletterPopup from "@/components/newsletter-popup";
import { Analytics } from "@vercel/analytics/next"

const defaultUrl = "https://enjoyescapes.com";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Enjoy Escapes - Curated Travel Experiences",
  description: "Discover unique travel escapes curated by Enjoy Escapes.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <div className="flex-1 w-full flex flex-col">
              <Navbar />
              <div className="w-full flex-1 flex flex-col">{children}</div>
              <Footer />
            </div>
            <NewsletterPopup />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
