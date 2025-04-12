import "./globals.css";

import AuthButton from "@/components/header-auth";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

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
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <Link
                    href={"/"}
                    className="flex items-center gap-2 font-semibold"
                  >
                    <Image
                      src="/logo.png"
                      alt="Enjoy Escapes Logo"
                      width={40}
                      height={40}
                      className="h-8 w-auto"
                    />
                    <span>Enjoy Escapes</span>
                  </Link>
                  <AuthButton />
                </div>
              </nav>
              <div className="w-full flex-1 flex flex-col">{children}</div>

              <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
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
