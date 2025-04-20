import "./globals.css";

import { Geist } from "next/font/google";
import Navbar from "@/app/components/navbar";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";

const defaultUrl = "https://enjoyescapes.com";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Enjoy Escapes - Curated Travel Experiences",
  description: "Discover unique travel escapes curated by Enjoy Escapes.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
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

              <footer className="w-full border-t border-t-foreground/10 p-8 flex flex-col items-center text-center text-xs gap-2">
                <div className="flex items-center justify-center text-muted-foreground/80 dark:text-muted-foreground/60 gap-2 text-[0.85em]">
                  <span className="inline-flex items-center gap-1">
                    Heads Up! These deals are updated frequently. Prices may
                    change due to availability and demand. New deals pop up
                    often!
                  </span>
                </div>
                <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-center gap-4">
                  <p>
                    &copy; {new Date().getFullYear()} Enjoy Escapes. All rights
                    reserved.
                  </p>
                  <div className="flex gap-4 items-center">
                    <a
                      href="https://tiktok.com/@sabrinaescapes"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      TikTok
                    </a>
                    <a
                      href="https://instagram.com/sabrinaescapes"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Instagram
                    </a>
                    <ThemeSwitcher />
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
