import "./globals.css";

import { Geist } from "next/font/google";
import Navbar from "@/app/components/navbar";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import NewsletterForm from "@/components/newsletter-form";
import { Separator } from "@/components/ui/separator";

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
        <Script id="mcjs" strategy="afterInteractive">
          {`!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/d3bcdbb57f5cdebdcba284cd8/749dacf33394b8f5d665c45d2.js")`}
        </Script>
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

              <footer className="w-full border-t border-t-foreground/10 mt-10">
                {/* Newsletter Section */}
                <div className="container">
                  <NewsletterForm />
                </div>
                
                <div className="container">
                  <Separator className="my-6 bg-foreground/5" />
                  <div className="flex flex-col items-center justify-center text-center pb-8">
                    <div className="text-muted-foreground/80 dark:text-muted-foreground/60 text-xs px-4 max-w-2xl">
                      <span>
                        Heads Up! These deals are updated frequently. Prices may
                        change due to availability and demand. New deals pop up
                        often!
                      </span>
                    </div>
                    <div className="mt-4 text-xs">
                      <p>
                        &copy; {new Date().getFullYear()} Enjoy Escapes. All rights
                        reserved.
                      </p>
                    </div>
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
