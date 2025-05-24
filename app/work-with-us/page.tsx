import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, MessageSquareHeart, Mail, BarChart, BookMarked, Smartphone, Heart, Globe, Calendar, Baby, Plane } from "lucide-react";
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Work with us
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Connect your travel brand with our engaged audience of adventure seekers
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl md:text-3xl font-bold">100M+</div>
                  <div className="text-sm opacity-80">Viewers per year</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl md:text-3xl font-bold">300K+</div>
                  <div className="text-sm opacity-80">Social followers</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image Area */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Placeholder for hero image - replace with your image */}
                <div className="w-80 h-96 bg-white/20 backdrop-blur rounded-3xl border border-white/30 flex items-center justify-center">
                  <div className="text-center">
                    <Plane className="h-16 w-16 mx-auto mb-4 opacity-60" />
                    <p className="text-sm opacity-60">Insert hero image here</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                  £1M+ sold!
                </div>
                <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  95% UK
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* We are the UK's favourite section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            We are the UK's <span className="text-accent italic font-script">favourite</span> travel deals platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We help boost views: With over 100 million viewers every year, our platform is the ultimate destination for travel inspiration and discovery. If you're looking to drive bookings, boost visibility, and connect directly with a highly engaged audience, we've got you covered.
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">            <div className="flex justify-center mb-4">              <Globe className="h-12 w-12 text-primary" />            </div>            <h3 className="text-4xl font-bold text-primary mb-2">OVER 100,000,000</h3>            <p className="text-primary/80 font-medium">Viewers per year</p>          </div>
          
                    <div className="text-center p-8 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-2xl">            <div className="flex justify-center mb-4">              <Users className="h-12 w-12 text-secondary" />            </div>            <h3 className="text-4xl font-bold text-secondary mb-2">OVER 300,000</h3>            <p className="text-secondary/80 font-medium">Social media followers</p>          </div>
          
                    <div className="text-center p-8 bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl">            <div className="flex justify-center mb-4">              <Heart className="h-12 w-12 text-accent" />            </div>            <h3 className="text-4xl font-bold text-accent mb-2">OVER £1,000,000</h3>            <p className="text-accent/80 font-medium">Holidays sold this year</p>          </div>
        </div>

        {/* Our Audience Section */}
        <div className="py-16 bg-gradient-to-r from-primary to-secondary rounded-3xl text-white mb-16">
          <div className="px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Audience</h2>
              <p className="text-xl opacity-90">
                83% of UK parents say they <span className="italic font-script">regularly</span> use our website for inspiration
              </p>
            </div>
            
            {/* Age Demographics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl md:text-3xl font-bold">25%</h3>
                <p className="text-sm opacity-80">aged 18-24</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl md:text-3xl font-bold">29%</h3>
                <p className="text-sm opacity-80">aged 25-34</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl md:text-3xl font-bold">22%</h3>
                <p className="text-sm opacity-80">aged 35-44</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl md:text-3xl font-bold">14%</h3>
                <p className="text-sm opacity-80">aged 45-54</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl md:text-3xl font-bold">10%</h3>
                <p className="text-sm opacity-80">aged 50+</p>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-3xl font-bold">95%</h3>
                <p className="opacity-80">are based in the UK</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-3xl font-bold">83%</h3>
                <p className="opacity-80">wish they could travel more</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-3xl font-bold">41%</h3>
                <p className="opacity-80">have kids under 16</p>
              </div>
            </div>
          </div>
        </div>

        {/* iPhone Mockups Section */}
        <div className="py-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Content That Converts</h2>
            <p className="text-xl text-muted-foreground">See how we showcase travel deals across our platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* iPhone Mockup 1 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Social Media Content Image */}
                    <Image 
                      src="/Social.jpeg" 
                      alt="Social Media Content" 
                      width={250} 
                      height={500} 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4 text-foreground">Social Media Posts</h3>
              <p className="text-muted-foreground text-center">Engaging visual content that drives clicks</p>
            </div>
            
            {/* iPhone Mockup 2 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Website Feature Image */}
                    <Image 
                      src="/website-features.png" 
                      alt="Website Features" 
                      width={300} 
                      height={500} 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4 text-foreground">Website Features</h3>
              <p className="text-muted-foreground text-center">Premium placement on our platform</p>
            </div>
          </div>
        </div>

        {/* Brands We Work With */}
        <div className="py-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Brands We've Worked With</h2>
            <p className="text-xl text-muted-foreground">Trusted by leading travel and lifestyle brands</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Brand Logo Placeholders */}
            {[
              "Gov.uk", "TUI", "loveholidays", "onthebeach", "Barbados", "Visit Portugal",
              "Birmingham Airport", "kayak", "Bandos Maldives", "Trip.com", "Samsung", "Norse"
            ].map((brand, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:scale-105 transition-all duration-300">
                <div className="h-16 flex items-center justify-center">
                  <div className="text-center">
                    <Image src={`/images/${brand.toLowerCase().replace(/\s+/g, '-')}.png`} alt={brand} width={100} height={100} className="w-full h-8 bg-muted rounded mb-2 flex items-center justify-center"/>
                    <div className="text-sm font-medium text-foreground">{brand}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="py-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Case Studies</h2>
            <p className="text-xl text-muted-foreground">Real results from our brand partnerships</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TUI Case Study */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative">
                {/* TUI Case Study Image */}
                <Image 
                  src="/case-studies/tui.jpg" 
                  alt="TUI January Sales Case Study" 
                  width={400} 
                  height={192} 
                  className="w-full h-full object-bottom object-cover"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-foreground">TUI January Sales</h3>
                <p className="text-muted-foreground mb-3">
                  With January being the biggest sales month of the year, TUI showed a competitive edge by using Enjoy Escapes to help boost visibility and surge sales.
                </p>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Through social media, our audience was excited by the amazing value for money package holidays TUI was providing and the stats speak for themselves.
                </p>
                
                {/* Enhanced Stats */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">551K</div>
                      <div className="text-xs text-muted-foreground font-medium">Total Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">42K</div>
                      <div className="text-xs text-muted-foreground font-medium">Total Clicks</div>
                    </div>
                  </div>
                </div>
                
                {/* <Button variant="outline" className="w-full mt-auto">Read Full Case Study</Button> */}
              </CardContent>
            </Card>
            
            {/* Norse Case Study */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gradient-to-br from-secondary to-secondary/80 relative">
                {/* Norse Case Study Image */}
                <Image 
                  src="/case-studies/norse.png" 
                  alt="Norse New route to Barbados Case Study" 
                  width={400} 
                  height={192} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-foreground">Norse New route to Barbados</h3>
                <p className="text-muted-foreground mb-3">
                  Norse Atlantic Airways launched its inaugural direct flight from London Gatwick to Barbados, and we had the honour of showcasing the experience and highlighting why Norse is the smart choice for travellers.
                </p>
                <p className="text-muted-foreground mb-6 flex-grow">
                  By documenting the experience, we made our audience feel like they were right there with us throughout the entire journey—through engaging videos and brand stories that could be easily be repurposed for their own social media.
                </p>
                
                {/* Enhanced Stats */}
                <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-xl p-4 mb-6 border border-secondary/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">675K</div>
                      <div className="text-xs text-muted-foreground font-medium">Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">15K</div>
                      <div className="text-xs text-muted-foreground font-medium">Clicks</div>
                    </div>
                  </div>
                </div>
                
                {/* <Button variant="outline" className="w-full mt-auto">Read Full Case Study</Button> */}
              </CardContent>
            </Card>
            
            {/* loveholidays Case Study */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gradient-to-br from-accent to-accent/80 relative">
                {/* loveholidays Case Study Image */}
                <Image 
                  src="/case-studies/loveholiday.png" 
                  alt="Love holiday Peaks Sale Case Study" 
                  width={400} 
                  height={192} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-foreground">Love holiday Peaks Sale</h3>
                <p className="text-muted-foreground mb-3">
                  How we helped loveholidays reach thousands of customers through targeted social campaigns and website features.
                </p>
                <p className="text-muted-foreground mb-6 flex-grow">
                  To boost sales, we developed a strategy designed to captivate and convert viewers at every touchpoint. No matter where they looked, our love holiday packages were front and center—promoted through engaging website features, compelling video content, and targeted email marketing.
                </p>
                
                {/* Enhanced Stats */}
                <div className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl p-4 mb-6 border border-accent/20">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-accent">1.69M</div>
                      <div className="text-xs text-muted-foreground font-medium">Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-accent">70K</div>
                      <div className="text-xs text-muted-foreground font-medium">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-accent">£120K</div>
                      <div className="text-xs text-muted-foreground font-medium">Sales</div>
                    </div>
                  </div>
                </div>
                
                {/* <Button variant="outline" className="w-full mt-auto">Read Full Case Study</Button> */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 mb-16">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 text-center text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Reach 100 Million Travel Enthusiasts?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join the brands that have already discovered the power of our engaged, travel-loving audience. Let's create something amazing together.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="mailto:Sabrina@EnjoyEscapes.com">
                  <Button size="lg" className="bg-gradient-to-r from-white to-gray-50 text-primary hover:from-gray-50 hover:to-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8 border border-white/50">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 