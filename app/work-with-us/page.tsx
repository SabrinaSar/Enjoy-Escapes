import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, MessageSquareHeart, Mail, BarChart, BookMarked } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Work With Us | Enjoy Escapes",
  description: "Partner with Enjoy Escapes to promote your travel offers and reach millions of travel enthusiasts.",
  keywords: "travel partners, travel marketing, travel promotions, hotel marketing, travel deals",
  alternates: {
    canonical: "https://enjoyescapes.com/work-with-us",
  },
  openGraph: {
    title: "Work With Us | Enjoy Escapes",
    description: "Partner with Enjoy Escapes to promote your travel offers and reach millions of travel enthusiasts.",
    type: "website",
    url: "https://enjoyescapes.com/work-with-us",
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
    title: "Work With Us | Enjoy Escapes",
    description: "Partner with Enjoy Escapes to promote your travel offers and reach millions of travel enthusiasts.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default function WorkWithUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Work With Us</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Connect your travel brand with our engaged audience of adventure seekers
          </p>
        </div>
      </div>
      
      {/* Main Introduction */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">We are the UK's fastest growing travel deals platform</h2>
        <p className="text-xl leading-relaxed">
          Since our launch, Enjoy Escapes has been helping thousands of travelers discover amazing getaways at unbeatable prices. From luxury beach retreats to city breaks and everything in between.
        </p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex justify-center mb-3">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">500,000+</h3>
          <p className="text-muted-foreground">Monthly visitors</p>
        </div>
        
        <div className="text-center p-6 bg-secondary/5 rounded-xl border border-secondary/10">
          <div className="flex justify-center mb-3">
            <Users className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">95%</h3>
          <p className="text-muted-foreground">UK-based audience</p>
        </div>
        
        <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/10">
          <div className="flex justify-center mb-3">
            <MessageSquareHeart className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-3xl font-bold mb-2">32%</h3>
          <p className="text-muted-foreground">Above-average engagement</p>
        </div>
      </div>
      
      {/* Audience Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Audience</h2>
          <p className="text-lg max-w-3xl mx-auto">
            We connect with travel enthusiasts who are actively seeking their next adventure
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
            <h3 className="text-3xl font-bold text-primary mb-2">70%</h3>
            <p className="text-muted-foreground">are aged 25-45</p>
          </div>
          
          <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
            <h3 className="text-3xl font-bold text-primary mb-2">65%</h3>
            <p className="text-muted-foreground">book 3+ trips per year</p>
          </div>
          
          <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
            <h3 className="text-3xl font-bold text-primary mb-2">85%</h3>
            <p className="text-muted-foreground">are deal-driven travelers</p>
          </div>
          
          <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
            <h3 className="text-3xl font-bold text-primary mb-2">40%</h3>
            <p className="text-muted-foreground">travel with families</p>
          </div>
        </div>
      </div>
      
      {/* Partners Section */}
      <div className="mb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Brands We've Worked With</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
            <div className="h-16 flex items-center justify-center">
              <div className="text-xl font-semibold text-muted-foreground">TUI</div>
            </div>
          </div>
          
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
            <div className="h-16 flex items-center justify-center">
              <div className="text-xl font-semibold text-muted-foreground">Booking.com</div>
            </div>
          </div>
          
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
            <div className="h-16 flex items-center justify-center">
              <div className="text-xl font-semibold text-muted-foreground">Expedia</div>
            </div>
          </div>
          
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
            <div className="h-16 flex items-center justify-center">
              <div className="text-xl font-semibold text-muted-foreground">Jet2holidays</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How We Can Work Together</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Customize your marketing approach with our range of partnership options
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Featured Deals</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Showcase your best offers with premium placement on our platform, reaching thousands of active deal-seekers.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Premium homepage placement</li>
                <li>• Social media amplification</li>
                <li>• Detailed performance analytics</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <BookMarked className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Bespoke Content</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Engage our audience with tailored content that highlights your destination or travel experience.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom written articles</li>
                <li>• Destination spotlights</li>
                <li>• Long-term SEO benefits</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Email Campaigns</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Reach our engaged email subscribers directly with exclusive offers tailored to their preferences.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 30%+ open rates</li>
                <li>• Segmented audience targeting</li>
                <li>• Conversion tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Case Studies Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg max-w-3xl mx-auto">
            See how brands have achieved exceptional results through our partnerships
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background rounded-xl overflow-hidden border">
            <div className="h-48 bg-gradient-to-r from-primary/90 to-secondary/90 flex items-center justify-center">
              <div className="text-2xl text-white font-bold">Beach Escapes Ltd</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">300% Booking Increase</h3>
              <p className="text-muted-foreground mb-4">
                Our featured deals campaign helped Beach Escapes triple their bookings for Mediterranean packages within just two weeks.
              </p>
              <Button variant="outline" className="w-full">Read Case Study</Button>
            </div>
          </div>
          
          <div className="bg-background rounded-xl overflow-hidden border">
            <div className="h-48 bg-gradient-to-r from-secondary/90 to-accent/90 flex items-center justify-center">
              <div className="text-2xl text-white font-bold">City Breaks Co</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">15k+ New Subscribers</h3>
              <p className="text-muted-foreground mb-4">
                Our tailored content series on European city breaks generated over 15,000 new subscribers for this boutique travel provider.
              </p>
              <Button variant="outline" className="w-full">Read Case Study</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center p-10 bg-primary/5 rounded-xl border border-primary/10 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Travel Brand?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Connect with our partnership team today to discover how we can help you reach more travelers.
        </p>
        <div className="flex justify-center">
          <Link href="mailto:partners@enjoyescapes.com">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 