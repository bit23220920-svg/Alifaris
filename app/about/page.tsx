import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Shield, Award, Users, Clock, Target, Heart, Building2, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | ALIFARIS Auto',
  description: 'Learn more about ALIFARIS Auto - your trusted destination for premium vehicles.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0164-auWE2yaxGb8qSKprlVDN8J4Tmp9CW7.jpg"
            alt="About ALIFARIS"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">About Us</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8">
              Welcome to <span className="text-gradient">ALIFARIS</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              About
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass rounded-3xl p-10 hover-lift card-glow">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-5 red-line pb-2">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                About
              </p>
            </div>
            <div className="glass rounded-3xl p-10 hover-lift card-glow">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-8">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-5 red-line pb-2">Our Vision</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                About
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-4">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">Why Choose Us</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              The <span className="text-primary">ALIFARIS</span> Difference
            </h2>
          </div> 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div className="glass rounded-2xl p-8 text-center hover-lift card-glow animate-fade-in-up">
              <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Shield className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                Every vehicle undergoes rigorous inspection to ensure the highest standards.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center hover-lift card-glow animate-fade-in-up stagger-1">
              <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Award className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Best Prices</h3>
              <p className="text-muted-foreground">
                Competitive pricing with transparent dealings and no hidden fees.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center hover-lift card-glow animate-fade-in-up stagger-2">
              <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Users className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Expert Team</h3>
              <p className="text-muted-foreground">
                Our knowledgeable staff is here to guide you through every step.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center hover-lift card-glow animate-fade-in-up stagger-3">
              <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Clock className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock customer service for index your inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-14 card-glow">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              <div className="group">
                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform">500+</p>
                <p className="text-muted-foreground text-lg">Vehicles Sold</p>
              </div>
              <div className="group">
                <p className="text-5xl sm:text-6xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform">15+</p>
                <p className="text-muted-foreground text-lg">Years Experience</p>
              </div>
              <div className="group">
                <p className="text-5xl sm:text-6xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform">98%</p>
                <p className="text-muted-foreground text-lg">Happy Customers</p>
              </div>
              <div className="group">
                <p className="text-5xl sm:text-6xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform">50+</p>
                <p className="text-muted-foreground text-lg">Car Brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Policies */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">Our Terms and Policies</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Alifaris Auto <span className="text-primary">Terms and Policies</span>
              </h2>
            </div>

            <div className="glass rounded-3xl p-6 sm:p-10 card-glow">
              <div className="space-y-8 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Welcome to Alifaris Auto. We specialize in the sale of luxury vehicles and provide
                  services across multiple locations nationwide. By engaging with our services, you
                  agree to abide by the terms outlined here.
                </p>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Definitions</h3>
                  <ul className="space-y-3 list-disc pl-6">
                    <li>“Buyer” refers to any individual or entity purchasing a vehicle from Alifaris Auto.</li>
                    <li>“Vehicle” refers to any luxury car or product offered for sale.</li>
                    <li>“Locations” refer to Alifaris Auto offices across the country.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Sales Terms</h3>
                  <p>
                    All sales are final upon completion of payment. Pricing is as stated at the time
                    of purchase. Deposits may be required to secure a vehicle, and these deposits are
                    non-refundable. The buyer is responsible for ensuring all financing or payments
                    are approved.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Financing and Trade-In Policies</h3>
                  <p>
                    Alifaris Auto offers financing options through third-party lenders. All financing
                    is subject to approval. Trade-in vehicles must be appraised, and offers are subject
                    to inspection and acceptance by Alifaris Auto.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Delivery and Inspection</h3>
                  <p>
                    Vehicles are delivered to the buyer’s designated location or the nearest Alifaris
                    Auto office. The buyer must inspect the vehicle upon delivery. Claims for damages
                    must be made within 24 hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Warranties and Disclaimers</h3>
                  <p>
                    All vehicles are sold “as-is,” unless otherwise specified. Manufacturer warranties
                    may apply. Alifaris Auto disclaims all other warranties, express or implied.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Liability Limitations</h3>
                  <p>
                    Alifaris Auto is not liable for incidental, consequential, or indirect damages
                    arising from the use or sale of a vehicle. Buyer assumes all risk upon purchase.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Privacy Policy</h3>
                  <p>
                    We respect your privacy. Personal data is collected solely for the purpose of
                    processing your purchase and will not be sold or shared without your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">Dispute Resolution</h3>
                  <p>
                    Any disputes arising from sales, services, or agreements with Alifaris Auto shall
                    first be addressed through internal negotiations between the buyer and the company.
                    If the matter cannot be resolved amicably, the dispute shall be handled in accordance
                    with the laws of Zambia. Any legal proceedings shall take place in the courts of
                    Lusaka. Alifaris Auto reserves the right to seek mediation or arbitration before
                    court action where appropriate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
