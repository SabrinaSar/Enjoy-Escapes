import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles, PiggyBank, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Enjoy Escapes",
  description: "Discover our mission to bring you amazing holiday deals without the sky-high price tag.",
  keywords: "travel deals, budget holidays, about enjoy escapes, travel deals uk",
  alternates: {
    canonical: "https://enjoyescapes.com/about",
  },
  openGraph: {
    title: "About Us | Enjoy Escapes",
    description: "Discover our mission to bring you amazing holiday deals without the sky-high price tag.",
    type: "website",
    url: "https://enjoyescapes.com/about",
    siteName: "Enjoy Escapes",
    images: [
      {
        url: "https://enjoyescapes.com/logo.png",
        width: 735,
        height: 735,
        alt: "Enjoy Escapes - Curated Travel Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Enjoy Escapes",
    description: "Discover our mission to bring you amazing holiday deals without the sky-high price tag.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About Enjoy Escapes</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            We find the deals. You enjoy the journey.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="prose dark:prose-invert max-w-none text-lg">
          <p className="text-xl leading-relaxed pb-2">
            At EnjoyEscapes, we believe amazing holidays shouldn't come with a sky-high price tag. That's why we're here to help you discover epic getaways without blowing the budget.
          </p>
          
          <p className="leading-relaxed pb-2">
            Our team of travel-hungry deal hunters is always on the lookout for unforgettable escapes at prices that make you do a double-take. Whether it's dreamy beach breaks, spontaneous city adventures, luxe-for-less stays, or cheeky weekend getaways we've got the goods.
          </p>
          
          <p className="leading-relaxed">
            We do the digging so you don't have to. Our handpicked deals land where you want them on our website, in your inbox, or scrolling through your socials. With thousands of fellow travel lovers joining the ride every month, EnjoyEscapes is quickly becoming the go-to for travel deals in the UK.
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <Card className="border hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Budget-Friendly</h3>
              </div>
              <p className="text-muted-foreground">
                We hunt for the best travel deals so you can experience more for less.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Handpicked Quality</h3>
              </div>
              <p className="text-muted-foreground">
                Each escape is carefully selected for its quality, value, and unforgettable experience.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Compass className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Diverse Destinations</h3>
              </div>
              <p className="text-muted-foreground">
                From beach paradises to city explorations, we cover destinations for every travel style.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">UK-Focused</h3>
              </div>
              <p className="text-muted-foreground">
                Our deals are tailored for UK travelers, with convenient departures and curated experiences.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* CTA Section */}
        <div className="bg-muted/30 rounded-xl p-8 text-center my-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Escape?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of fellow travel lovers who are discovering amazing deals every day.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Deals
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline">
                Search Escapes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 