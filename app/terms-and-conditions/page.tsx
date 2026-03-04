import type { Metadata } from "next";
import {
  Shield,
  FileText,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
  CreditCard,
  Ban,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions | Enjoy Escapes",
  description:
    "Read our Terms and Conditions to understand the rules and guidelines governing your use of Enjoy Escapes services.",
  keywords: "terms and conditions, legal, terms of use, enjoy escapes",
  alternates: {
    canonical: "https://enjoyescapes.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Enjoy Escapes",
    description:
      "Read our Terms and Conditions to understand the rules and guidelines governing your use of Enjoy Escapes services.",
    type: "website",
    url: "https://enjoyescapes.com/terms-and-conditions",
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
    title: "Terms & Conditions | Enjoy Escapes",
    description:
      "Read our Terms and Conditions to understand the rules and guidelines governing your use of Enjoy Escapes services.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    color: "primary" as const,
    content: [
      "By accessing and using the Enjoy Escapes website (enjoyescapes.com) and its services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
      "These Terms and Conditions apply to all visitors, users, and others who access or use the Service. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the Service after any changes constitutes acceptance of the new Terms and Conditions.",
    ],
  },
  {
    id: "services",
    icon: Globe,
    title: "2. Description of Services",
    color: "secondary" as const,
    content: [
      "Enjoy Escapes is an affiliate and deal-aggregation platform that curates travel deals and holiday packages from third-party providers. We do not directly sell travel packages, flights, accommodations, or any other travel products.",
      "Our role is to present and share deals sourced from third-party travel providers. When you click on a deal, you will be redirected to the third-party provider's website where the booking and transaction will take place. Enjoy Escapes is not a party to any transaction between you and the third-party provider.",
      "We strive to ensure that the information presented on our website is accurate and up-to-date, but we cannot guarantee the accuracy, completeness, or reliability of any deal information. Prices, availability, and deal terms are subject to change by the third-party providers at any time.",
    ],
  },
  {
    id: "user-obligations",
    icon: Shield,
    title: "3. User Obligations",
    color: "accent" as const,
    content: [
      "You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.",
      "You must not misuse our website by knowingly introducing viruses, trojans, worms, logic bombs, or other material that is malicious or technologically harmful. You must not attempt to gain unauthorised access to our website, the server on which our website is stored, or any server, computer, or database connected to our website.",
      "You are responsible for ensuring that all persons who access our website through your internet connection are aware of these Terms and Conditions and that they comply with them.",
    ],
  },
  {
    id: "intellectual-property",
    icon: Scale,
    title: "4. Intellectual Property",
    color: "primary" as const,
    content: [
      "All content on the Enjoy Escapes website—including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations—is the property of Enjoy Escapes or its content suppliers and is protected by United Kingdom and international copyright laws.",
      "You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without the prior written consent of Enjoy Escapes, except as permitted by applicable law.",
      "The Enjoy Escapes name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Enjoy Escapes. You must not use such marks without the prior written permission of Enjoy Escapes.",
    ],
  },
  {
    id: "affiliate-links",
    icon: CreditCard,
    title: "5. Affiliate Links & Third-Party Content",
    color: "secondary" as const,
    content: [
      "Our website contains affiliate links to third-party websites. This means that we may earn a commission if you click on a link and make a purchase or booking on a third-party website. This is at no additional cost to you.",
      "We are not responsible for the content, accuracy, privacy practices, or opinions expressed on third-party websites. The inclusion of any link does not imply our endorsement of the linked website or its content.",
      "Any interactions, transactions, or disputes that arise between you and a third-party provider are solely between you and that provider. Enjoy Escapes is not liable for any loss, damage, or claim arising from your dealings with third-party providers.",
    ],
  },
  {
    id: "disclaimers",
    icon: AlertTriangle,
    title: "6. Disclaimers & Limitation of Liability",
    color: "accent" as const,
    content: [
      'The information on our website is provided on an "as is" basis without any warranties, express or implied. Enjoy Escapes does not warrant that the website will be available at all times or that the information contained on the website is complete, true, accurate, or non-misleading.',
      "To the fullest extent permitted by applicable law, Enjoy Escapes excludes all liability for any loss or damage—whether direct, indirect, incidental, special, consequential, or punitive—arising out of or in connection with your use of, or inability to use, our website or any third-party websites linked from our website.",
      "We do not guarantee the accuracy of any travel deal pricing, availability, or terms displayed on our website. All deal information is subject to verification with the relevant third-party provider at the time of booking.",
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "7. Privacy & Data Protection",
    color: "primary" as const,
    content: [
      "We take your privacy seriously. Any personal information you provide to us—such as your email address when subscribing to our newsletter—will be handled in accordance with our Privacy Policy and the UK General Data Protection Regulation (UK GDPR).",
      "We use cookies and similar tracking technologies to enhance your experience on our website. By continuing to use our website, you consent to our use of cookies as described in our Cookie Policy.",
      "You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, please contact us using the details provided at the bottom of this page.",
    ],
  },
  {
    id: "newsletter",
    icon: Mail,
    title: "8. Newsletter & Communications",
    color: "secondary" as const,
    content: [
      "By subscribing to our newsletter, you agree to receive marketing communications from Enjoy Escapes, including travel deals, promotional offers, and updates about our services.",
      "You can unsubscribe from our newsletter at any time by clicking the 'unsubscribe' link at the bottom of any email we send you, or by contacting us directly.",
      "We will never sell, rent, or share your email address with third parties for their marketing purposes without your explicit consent.",
    ],
  },
  {
    id: "termination",
    icon: Ban,
    title: "9. Termination",
    color: "accent" as const,
    content: [
      "We reserve the right to terminate or suspend your access to our website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.",
      "Upon termination, your right to use the website will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
    ],
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "10. Changes to Terms",
    color: "primary" as const,
    content: [
      "We reserve the right to modify or replace these Terms and Conditions at any time at our sole discretion. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.",
      "What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.",
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

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white rounded-full animate-pulse delay-700" />
        </div>

        <div className="mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Please read these terms carefully before using our services.
            </p>

            {/* Quick highlights */}
            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                <Shield className="inline h-4 w-4 mr-2" />
                Transparent
              </div>
              <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                <Scale className="inline h-4 w-4 mr-2" />
                Fair Use
              </div>
            </div>

            <p className="text-sm opacity-70">Last updated: February 2026</p>
          </div>
        </div>
      </div>

      <div className=" max-w-7xl mx-auto px-4">
        <div className="mx-auto py-16">
          {/* Introductory Card */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur mb-12">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-foreground">
                Welcome to Enjoy Escapes. These Terms and Conditions outline the
                rules and regulations for the use of our website and services.
                By accessing this website, we assume you accept these terms and
                conditions. Do not continue to use Enjoy Escapes if you do not
                agree to take all of the terms and conditions stated on this
                page.
              </p>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Table of Contents
              </h2>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const colors = colorMap[section.color];
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/60 transition-all duration-200 group"
                    >
                      <div
                        className={`${colors.iconBg} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`h-4 w-4 ${colors.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {section.title}
                      </span>
                    </a>
                  );
                })}
              </nav>
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
                  className={`border-0 border-l-4 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${colors.gradient} scroll-mt-24`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`${colors.iconBg} p-4 rounded-full`}>
                        <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                      </div>
                      <h2 className={`text-2xl font-bold ${colors.titleColor}`}>
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {section.content.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-muted-foreground leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 text-center text-white relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-16 h-16 bg-white rounded-full" />
                <div className="absolute bottom-10 right-10 w-12 h-12 bg-white rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full" />
              </div>

              <div className="relative z-10">
                <Mail className="h-10 w-10 mx-auto mb-4 opacity-90" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Questions About Our Terms?
                </h2>
                <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                  If you have any questions about these Terms and Conditions,
                  please don't hesitate to contact us.
                </p>
                <a
                  href="mailto:hello@enjoyescapes.com"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Mail className="h-5 w-5" />
                  hello@enjoyescapes.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
