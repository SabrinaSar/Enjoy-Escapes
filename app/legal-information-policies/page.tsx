import { Metadata } from "next";
import {
  Shield,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
  CreditCard,
  Camera,
  Cookie,
  Info,
  Megaphone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Legal Information & Policies | Enjoy Escapes",
  description:
    "Read the Enjoy Escapes legal policies, deal disclaimers, and affiliate disclosures.",
  keywords: "legal, terms and conditions, privacy policy, affiliate disclosure, enjoy escapes",
  alternates: {
    canonical: "https://enjoyescapes.com/legal-information-policies",
  },
  openGraph: {
    title: "Legal Information & Policies | Enjoy Escapes",
    description: "Understand the terms and guidelines governing your use of Enjoy Escapes.",
    type: "website",
    url: "https://enjoyescapes.com/legal-information-policies",
    siteName: "Enjoy Escapes",
    images: [{ url: "https://enjoyescapes.com/logo.png", width: 735, height: 735, alt: "Enjoy Escapes" }],
  },
};

const sections = [
  {
    id: "about",
    icon: Info,
    title: "1. About Enjoy Escapes",
    color: "primary" as const,
    content: [
      "Enjoy Escapes is a website that shares travel deals found online. Our goal is to help users discover attractive travel offers from a variety of third-party travel providers.",
      "Enjoy Escapes does not operate as a travel agent, tour operator, or booking service. All bookings are completed directly with the travel provider or website to which you are redirected.",
      "When you click on a deal on this website, you will be taken to a third-party website where the booking or purchase takes place.",
    ],
  },
  {
    id: "price-disclaimer",
    icon: AlertTriangle,
    title: "2. Deal Information & Price Disclaimer",
    color: "secondary" as const,
    content: [
      "We aim to ensure that the deal information and prices shown on Enjoy Escapes are accurate at the time they are posted.",
      "However:",
      "• Prices and availability may change at any time.",
      "• Deals may sell out or expire without notice.",
      "• Prices shown may be “from” prices and may be based on factors such as (but not limited to):",
      "  • price per person",
      "  • price per room",
      "  • limited availability",
      "  • specific travel dates",
      "  • promotional or limited-time offers",
      "  • availability at the time of booking",
      "Enjoy Escapes does not update deal prices after publication, and we cannot guarantee that the price displayed on this website will still be available when you click through to the provider.",
      "All pricing, availability, booking terms, and travel conditions are determined by the third-party travel provider.",
    ],
  },
  {
    id: "third-party",
    icon: Globe,
    title: "3. Third-Party Websites",
    color: "accent" as const,
    content: [
      "Enjoy Escapes contains links that redirect users to third-party websites.",
      "These websites operate independently and have their own:",
      "• terms and conditions",
      "• privacy policies",
      "• booking policies",
      "Enjoy Escapes is not responsible for the content, services, pricing, or booking experience provided by these third-party websites.",
      "Any travel bookings, purchases, or agreements you make are solely between you and the travel provider.",
    ],
  },
  {
    id: "affiliate",
    icon: CreditCard,
    title: "4. Affiliate Disclosure",
    color: "primary" as const,
    content: [
      "Some links on Enjoy Escapes are affiliate links.",
      "This means that if you click on certain links and make a purchase or booking, Enjoy Escapes may earn a small commission. This commission comes at no additional cost to you.",
      "Affiliate links help support the operation of the website and allow us to continue sharing travel deals.",
      "Not all links on Enjoy Escapes are affiliate links. Some deals are shared simply because we believe they may be useful or interesting to our readers.",
    ],
  },
  {
    id: "advertising",
    icon: Megaphone,
    title: "5. Advertising",
    color: "secondary" as const,
    content: [
      "Enjoy Escapes may display advertisements or sponsored links.",
      "These advertisements may be served by third-party advertising networks and may use cookies or similar technologies to deliver relevant ads.",
      "Enjoy Escapes is not responsible for the content or claims made in third-party advertisements.",
    ],
  },
  {
    id: "images",
    icon: Camera,
    title: "6. Images and Content",
    color: "accent" as const,
    content: [
      "Images used on Enjoy Escapes may originate from third-party travel providers, hotel websites, airlines, or promotional materials associated with the deals being shared.",
      "These images are used for illustrative purposes only to help represent the travel deal being described.",
      "If you are the copyright owner of any content used on this website and believe it should be removed, please contact us and we will review the request promptly.",
    ],
  },
  {
    id: "liability",
    icon: Scale,
    title: "7. Limitation of Liability",
    color: "primary" as const,
    content: [
      "While we strive to provide accurate and helpful information, Enjoy Escapes makes no guarantees regarding:",
      "• deal availability",
      "• pricing accuracy after posting",
      "• travel provider services",
      "• booking outcomes",
      "Enjoy Escapes will not be liable for any losses, damages, or issues that arise from:",
      "• expired or incorrect pricing",
      "• booking errors",
      "• travel provider cancellations",
      "• changes made by airlines, hotels, or travel companies",
      "Users rely on the information provided on this website at their own discretion.",
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "8. Privacy Policy",
    color: "secondary" as const,
    content: [
      "Enjoy Escapes respects your privacy and is committed to protecting your personal data in accordance with UK GDPR.",
      "We may collect limited personal data when you interact with the website.",
      "This may include:",
      "• email addresses submitted through our newsletter signup",
      "• technical information such as IP address",
      "• browser type and device information",
      "• website usage data collected through analytics tools",
      "This information may be used to:",
      "• send newsletters and travel deal updates",
      "• improve the website",
      "• analyse website traffic and user behaviour",
      "Your personal information will not be sold to third parties.",
      "You may unsubscribe from our newsletter at any time by using the unsubscribe link included in emails.",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "9. Cookies",
    color: "accent" as const,
    content: [
      "Enjoy Escapes may use cookies and similar technologies to improve the user experience.",
      "Cookies may be used for purposes such as:",
      "• website functionality",
      "• analytics and traffic analysis",
      "• affiliate link tracking",
      "• advertising performance",
      "Cookies are small text files stored on your device by your browser.",
      "You can control or disable cookies through your browser settings. Please note that disabling cookies may affect how some parts of the website function.",
    ],
  },
];

const colorMap = {
  primary: {
    gradient: "from-primary/5 to-primary/10",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    titleColor: "text-primary",
    border: "border-l-primary",
  },
  secondary: {
    gradient: "from-secondary/5 to-secondary/10",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
    titleColor: "text-secondary",
    border: "border-l-secondary",
  },
  accent: {
    gradient: "from-accent/5 to-accent/10",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    titleColor: "text-accent",
    border: "border-l-accent",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-primary via-secondary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Legal Information &amp; Policies
            </h1>
            <p className="text-xs md:text-sm opacity-80 mb-2 font-medium tracking-wide border border-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mx-auto pt-6 md:pt-12">
          {/* Introductory Card */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur mb-8 md:mb-12">
            <CardContent className="p-6 md:p-10">
              <div className="space-y-4 md:space-y-6">
                <p className="text-base md:text-lg leading-relaxed text-foreground">
                  Welcome to Enjoy Escapes (EnjoyEscapes.com). By accessing or using this website, 
                  you agree to the terms outlined below. If you do not agree with these terms, 
                  please do not use this website.
                </p>
                <div className="h-px w-20 bg-gradient-to-r from-primary/50 to-transparent" />
                <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                  Enjoy Escapes provides travel deal information for informational purposes only. 
                  We do not sell travel products or services directly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              const colors = colorMap[section.color];
              return (
                <Card
                  key={section.id}
                  id={section.id}
                  className={`border-0 border-l-4 ${colors.border} shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br ${colors.gradient} scroll-mt-24 overflow-hidden`}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div className={`${colors.iconBg} p-3 md:p-4 rounded-2xl w-fit`}>
                        <Icon className={`h-5 w-5 md:h-6 md:w-6 ${colors.iconColor}`} />
                      </div>
                      <h2 className={`text-xl md:text-2xl font-bold ${colors.titleColor}`}>
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {section.content.map((paragraph, index) => {
                        const isBullet = paragraph.trim().startsWith("•");
                        const isSubBullet = paragraph.startsWith("  •");
                        
                        return (
                          <div 
                            key={index} 
                            className={`flex gap-3 text-muted-foreground leading-relaxed ${
                              isSubBullet ? "pl-6 sm:pl-10 text-sm" : isBullet ? "pl-0 sm:pl-4" : ""
                            }`}
                          >
                            <p className="text-sm md:text-base">
                              {paragraph}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-6 sm:mt-12 md:mt-20 ">
            <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Mail className="h-32 w-32" />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <Mail className="h-12 w-12 mx-auto mb-6 bg-white/10 p-3 rounded-2xl backdrop-blur-md" />
                <h2 className="text-2xl md:text-4xl font-bold mb-6">
                  Questions About Our Policies?
                </h2>
                <p className="text-white/80 mb-8 text-base md:text-lg">
                  Our team is here to help clarify any aspect of our terms and conditions.
                </p>
                <a
                  href="mailto:info@enjoyescapes.com"
                  className="group relative inline-flex items-center gap-3 bg-white text-primary hover:bg-white/90 font-bold px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  <span className="relative z-10">Contact Support</span>
                  <div className="p-1 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                </a>
                <div className="mt-6 text-sm opacity-60">
                  info@enjoyescapes.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
