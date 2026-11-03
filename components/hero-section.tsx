'use client'

import { ArrowRight, Shield, Award, Headphones, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0162-wwlxk8M12Vra3YuD5AnS5EaAGinc9a.jpg"
          alt="Mercedes G63 AMG"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Multiple overlay layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        {/* Red accent glow */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 blur-[120px]" />
      </div>

      {/* Animated floating elements */}
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-red mb-8 animate-slide-in-left">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-foreground/90">Premium Auto Dealership</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 animate-fade-in-up">
              <span className="text-foreground">Drive Your</span>
              <span className="block text-gradient text-6xl sm:text-7xl lg:text-8xl my-2">DREAM</span>
              <span className="text-foreground/80">Today</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in-up stagger-2">
              Welcome to ALIFARISO Auto Spare. Discover our exclusive collection of premium vehicles - from rugged Land Cruisers to luxurious Mercedes AMG. Your perfect ride awaits.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16 animate-fade-in-up stagger-3">
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-full animate-pulse-glow group"
              >
                <Link href="/inventory">
                  View Inventory
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-border/50 hover:bg-secondary/50 hover:border-primary/50 px-8 py-6 text-base font-semibold rounded-full backdrop-blur-sm"
              >
                <Link href="/contact">
                  Get In Touch
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 animate-fade-in-up stagger-4">
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Premium Cars</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Support</div>
              </div>
            </div>
          </div>

          {/* Right side - Feature Cards */}
          <div className="hidden lg:block">
            <div className="grid gap-4 animate-slide-in-right">
              {/* Trust badges */}
              <div className="glass-light rounded-2xl p-6 hover-lift card-glow">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Certified Quality</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Every vehicle thoroughly inspected</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                </div>
              </div>
              
              <div className="glass-light rounded-2xl p-6 hover-lift card-glow stagger-1">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Best Prices</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Competitive rates guaranteed</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                </div>
              </div>
              
              <div className="glass-light rounded-2xl p-6 hover-lift card-glow stagger-2">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Headphones className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">We are always here for you</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
