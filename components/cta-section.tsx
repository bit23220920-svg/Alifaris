import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, ArrowRight, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg"
          alt="Mercedes G63 AMG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/80" />
      </div>

      {/* Floating accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground/80">Ready to Drive?</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
            {"Let's Find Your"} <br />
            <span className="text-gradient">Perfect Vehicle</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Our team of experts is ready to help you find the ideal car that fits your lifestyle and budget. Get in touch today and drive away in your dream car!
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-7 text-base font-semibold rounded-full animate-pulse-glow group"
            >
              <a 
                href="https://wa.me/260977844509?text=Hello!%20I'm%20interested%20in%20your%20vehicles." 
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                WhatsApp Us Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-border/50 hover:border-primary/50 hover:bg-primary/5 px-10 py-7 text-base font-semibold rounded-full backdrop-blur-sm group"
            >
              <Link href="/inventory">
                <Car className="mr-2 w-5 h-5" />
                Browse Inventory
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-border/30">
            <div className="group">
              <p className="text-4xl sm:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">500+</p>
              <p className="text-sm text-muted-foreground mt-2">Vehicles Sold</p>
            </div>
            <div className="group">
              <p className="text-4xl sm:text-5xl font-bold text-foreground group-hover:scale-110 transition-transform">15+</p>
              <p className="text-sm text-muted-foreground mt-2">Years Experience</p>
            </div>
            <div className="group">
              <p className="text-4xl sm:text-5xl font-bold text-foreground group-hover:scale-110 transition-transform">98%</p>
              <p className="text-sm text-muted-foreground mt-2">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
