import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl max-sm:left-0 max-sm:w-64 max-sm:h-64" />

      <div className="container mx-auto relative px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex" aria-label="ALIFARIS Auto home">
              <Image
                src="/assets/alifaris-logo.png"
                alt="ALIFARIS Auto"
                width={360}
                height={203}
                className="h-24 w-auto object-contain sm:h-32 lg:h-40"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted destination for premium vehicles. We offer the finest selection of SUVs, Trucks, and Luxury cars.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-11 h-11 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/260977844509"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 red-line pb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Our Inventory
                </Link>
              </li>
              <li>
                <Link href="/spares" className="inline-flex text-sm text-muted-foreground transition-all hover:text-orange-400 hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Shop Spares
                </Link>
              </li>
              <li>
                <Link href="/admin" target="_blank" rel="noopener noreferrer" className="inline-flex text-sm text-muted-foreground transition-all hover:text-orange-400 hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 red-line pb-2">Categories</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/inventory?category=suv" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  SUV
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=truck" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Truck
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=luxury" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Luxury
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=sedan" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Sedan
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=coupe" className="inline-flex text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 py-2 min-h-[44px] items-center">
                  Coupe
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 red-line pb-2">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  123 Auto Boulevard, Car City, CC 12345
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <a href="mailto:sichulaj03@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  sichulaj03@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                  <p>Sat: 10:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 md:mt-16 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="text-primary">ALIFARIS</span> Auto. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-6">
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
