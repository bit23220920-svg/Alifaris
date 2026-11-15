import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, ArrowRight, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '260977844509'
const CTA_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg"
          alt="Mercedes G63 AMG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-8 rounded-lg border border-border/60 bg-card/95 p-6 shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </span>
              <span className="text-sm font-black uppercase tracking-wide">Ready to Drive?</span>
            </div>
          
            <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {"Let's Find Your Perfect Vehicle"}
            </h2>
          
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Our team of experts is ready to help you find the ideal car that fits your lifestyle and budget. Get in touch today and drive away in your dream car!
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button 
              asChild
              size="lg" 
              className="w-full bg-[#25D366] px-8 py-6 text-base font-bold text-white group hover:bg-[#128C7E] sm:w-auto"
            >
              <a 
                href={CTA_WHATSAPP_URL}
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
              className="w-full border-border/70 px-8 py-6 text-base font-bold group hover:border-primary/50 hover:bg-primary/5 sm:w-auto"
            >
              <Link href="/inventory">
                <Car className="mr-2 w-5 h-5" />
                Browse Inventory
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="group">
            <div className="rounded-lg border border-border/60 bg-card/90 p-4 text-center">
              <p className="text-3xl font-black text-primary">500+</p>
              <p className="mt-1 text-xs text-muted-foreground">Vehicles Sold</p>
            </div>
            </div>
            <div className="group">
            <div className="rounded-lg border border-border/60 bg-card/90 p-4 text-center">
              <p className="text-3xl font-black text-foreground">15+</p>
              <p className="mt-1 text-xs text-muted-foreground">Years Experience</p>
            </div>
            </div>
            <div className="group">
            <div className="rounded-lg border border-border/60 bg-card/90 p-4 text-center">
              <p className="text-3xl font-black text-foreground">98%</p>
              <p className="mt-1 text-xs text-muted-foreground">Happy Customers</p>
            </div>
            </div>
          </div>
      </div>
    </section>
  )
}
