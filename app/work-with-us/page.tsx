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
                    {/* Placeholder for iPhone content */}
                    <div className="h-full bg-gradient-to-br from-primary/10 to-primary/30 flex flex-col items-center justify-center p-6">
                      <Smartphone className="h-16 w-16 text-primary mb-4" />
                      <p className="text-sm text-primary text-center">Insert iPhone mockup image 1 here<br/>(Social Media Content)</p>
                    </div>
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
                    <div className="h-full bg-gradient-to-br from-secondary/10 to-secondary/30 flex flex-col items-center justify-center p-6">
                      <Smartphone className="h-16 w-16 text-secondary mb-4" />
                      <p className="text-sm text-secondary text-center">Insert iPhone mockup image 2 here<br/>(Website Content)</p>
                    </div>
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
              "Birmingham Airport", "KayKay", "Bandos Maldives", "Trip.com", "Samsung", "Norse"
            ].map((brand, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 grayscale hover:grayscale-0">
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
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative">
                {/* Placeholder for case study image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">TUI</div>
                    <p className="text-sm opacity-80">Insert case study image here</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">TUI Partnership Success</h3>
                <p className="text-muted-foreground mb-4">
                  How we helped TUI reach thousands of new customers through targeted social campaigns and website features.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-muted-foreground">• 250% increase in bookings</div>
                  <div className="text-sm text-muted-foreground">• 50K+ social media impressions</div>
                  <div className="text-sm text-muted-foreground">• 15% conversion rate</div>
                </div>
                <Button variant="outline" className="w-full">Read Full Case Study</Button>
              </CardContent>
            </Card>
            
            {/* Norse Case Study */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-secondary to-secondary/80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">Norse</div>
                    <p className="text-sm opacity-80">Insert case study image here</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Norse Atlantic Airways</h3>
                <p className="text-muted-foreground mb-4">
                  Launching a new airline route with strategic content marketing and audience engagement.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-muted-foreground">• 500K+ content views</div>
                  <div className="text-sm text-muted-foreground">• 30% email open rate</div>
                  <div className="text-sm text-muted-foreground">• 200+ flight bookings</div>
                </div>
                <Button variant="outline" className="w-full">Read Full Case Study</Button>
              </CardContent>
            </Card>
            
            {/* loveholidays Case Study */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-accent to-accent/80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">loveholidays</div>
                    <p className="text-sm opacity-80">Insert case study image here</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">loveholidays Campaign</h3>
                <p className="text-muted-foreground mb-4">
                  Multi-channel approach driving significant ROI through our engaged travel community.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-muted-foreground">• £100K+ in bookings</div>
                  <div className="text-sm text-muted-foreground">• 40% click-through rate</div>
                  <div className="text-sm text-muted-foreground">• 1M+ social reach</div>
                </div>
                <Button variant="outline" className="w-full">Read Full Case Study</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partnership Options */}
        {/* <div className="py-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Partnership Options</h2>
            <p className="text-xl text-gray-600">Flexible ways to work together</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">              <CardContent className="p-8 text-center">                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">                  <BarChart className="h-8 w-8 text-primary" />                </div>                <h3 className="text-xl font-bold mb-4 text-gray-800">Featured Deals</h3>                <p className="text-gray-600 mb-6">                  Premium placement across our platform with detailed analytics and social amplification.                </p>                <ul className="text-left space-y-2 text-sm text-gray-600 mb-6">                  <li>• Homepage placement</li>                  <li>• Social media posts</li>                  <li>• Email newsletter features</li>                  <li>• Performance tracking</li>                </ul>                <Button className="w-full bg-primary hover:bg-primary/90">Learn More</Button>              </CardContent>            </Card>
            
                        <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300">              <CardContent className="p-8 text-center">                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">                  <BookMarked className="h-8 w-8 text-secondary" />                </div>                <h3 className="text-xl font-bold mb-4 text-gray-800">Content Partnership</h3>                <p className="text-gray-600 mb-6">                  Custom content creation that showcases your brand to our engaged audience.                </p>                <ul className="text-left space-y-2 text-sm text-gray-600 mb-6">                  <li>• Destination guides</li>                  <li>• Video content</li>                  <li>• Social media series</li>                  <li>• SEO benefits</li>                </ul>                <Button className="w-full bg-secondary hover:bg-secondary/90">Learn More</Button>              </CardContent>            </Card>
            
                        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-300">              <CardContent className="p-8 text-center">                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">                  <Mail className="h-8 w-8 text-accent" />                </div>                <h3 className="text-xl font-bold mb-4 text-gray-800">Email Campaigns</h3>                <p className="text-gray-600 mb-6">                  Direct access to our highly engaged email subscribers with excellent open rates.                </p>                <ul className="text-left space-y-2 text-sm text-gray-600 mb-6">                  <li>• Dedicated sends</li>                  <li>• Newsletter inclusions</li>                  <li>• Audience segmentation</li>                  <li>• Conversion tracking</li>                </ul>                <Button className="w-full bg-accent hover:bg-accent/90">Learn More</Button>              </CardContent>            </Card>
          </div>
        </div> */}

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