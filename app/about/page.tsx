import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles, PiggyBank, Globe, Plane, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-primary via-secondary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">About Enjoy Escapes</h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                We find the deals. You enjoy the journey.
              </p>
              
              {/* Quick highlights */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                  <Plane className="inline h-4 w-4 mr-2" />
                  Budget-Friendly
                </div>
                <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  UK-Focused
                </div>
              </div>
              
              {/* Subtle floating badges */}
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="bg-accent/20 border border-accent/30 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  ✨ Epic Deals
                </div>
                <div className="bg-secondary/20 border border-secondary/30 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  🇬🇧 UK's Favourite
                </div>
              </div>
            </div>
            
            {/* Mission Statement */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                At EnjoyEscapes, we believe amazing holidays shouldn't come with a sky-high price tag. That's why we're here to help you discover epic getaways without blowing the budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto py-16">
          <div className="prose dark:prose-invert max-w-none text-lg">
            <div className="bg-card/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-border mb-8">
              <p className="text-xl leading-relaxed pb-2 text-foreground">
                At EnjoyEscapes, we believe amazing holidays shouldn't come with a sky-high price tag. That's why we're here to help you discover epic getaways without blowing the budget.
              </p>
              
              <p className="leading-relaxed pb-2 text-foreground">
                Our team of travel-hungry deal hunters is always on the lookout for unforgettable escapes at prices that make you do a double-take. Whether it's dreamy beach breaks, spontaneous city adventures, luxe-for-less stays, or cheeky weekend getaways we've got the goods.
              </p>
              
              <p className="leading-relaxed text-foreground">
                We do the digging so you don't have to. Our handpicked deals land where you want them on our website, in your inbox, or scrolling through your socials. With thousands of fellow travel lovers joining the ride every month, EnjoyEscapes is quickly becoming the go-to for travel deals in the UK.
              </p>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <PiggyBank className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Budget-Friendly</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  We hunt for the best travel deals so you can experience more for less.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-secondary/20 p-4 rounded-full">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">Handpicked Quality</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Each escape is carefully selected for its quality, value, and unforgettable experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-accent/20 p-4 rounded-full">
                    <Compass className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-accent">Diverse Destinations</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  From beach paradises to city explorations, we cover destinations for every travel style.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">UK-Focused</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Our deals are tailored for UK travelers, with convenient departures and curated experiences.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* CTA Section */}
          <div className="my-16">
            <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 text-center text-white relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-16 h-16 bg-white rounded-full" />
                <div className="absolute bottom-10 right-10 w-12 h-12 bg-white rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Escape?</h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of fellow travel lovers who are discovering amazing deals every day.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Link href="/">
                    <Button size="lg" className="bg-gradient-to-r from-white to-gray-50 text-primary hover:from-gray-50 hover:to-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8 border border-white/50">
                      Explore Deals
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button size="lg" className="bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 font-semibold px-8">
                      Search Escapes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 