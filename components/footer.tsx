import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="relative h-20 w-60">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260410-WA0087-DW6pHR8lrQGwJQ6AHRtqKY7C0sKPd1.jpg"
                alt="ALIFARISO Auto Spare"
                fill
                className="object-contain object-left mix-blend-multiply dark:mix-blend-screen dark:invert-0"
                style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted destination for premium vehicles. We offer the finest selection of SUVs, Trucks, and Luxury cars.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/260977844509"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-red flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 red-line pb-2">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Our Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6 red-line pb-2">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/inventory?category=suv" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  SUV
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=truck" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Truck
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=luxury" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Luxury
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=sedan" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
                  Sedan
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=coupe" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex">
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
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="text-primary">ALIFARISO</span> Auto Spare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
