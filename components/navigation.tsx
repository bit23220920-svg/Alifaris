'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { categories } from '@/lib/cars-data'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white transition-transform group-hover:scale-105">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260410-WA0087-DW6pHR8lrQGwJQ6AHRtqKY7C0sKPd1.jpg"
                alt="ALIFARISO Auto Spare"
                fill
                className="object-cover mix-blend-multiply dark:mix-blend-screen dark:invert-0"
                style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            <Link 
              href="/" 
              className="relative text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 outline-none">
                Inventory <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-border/50 mt-2">
                <DropdownMenuItem asChild>
                  <Link href="/inventory" className="cursor-pointer font-medium">
                    All Vehicles
                  </Link>
                </DropdownMenuItem>
                <div className="h-px bg-border/50 my-1" />
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link 
                      href={`/inventory?category=${category.id}`}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="/about" 
              className="relative text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              About
            </Link>
            
            <Link 
              href="/contact" 
              className="relative text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Contact
            </Link>
          </div>

          {/* WhatsApp Button */}
          <div className="flex items-center gap-4">
            <Button 
              asChild
              className="hidden md:flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-6 animate-pulse-glow rounded-full"
            >
              <a 
                href="https://wa.me/260977844509?text=Hello!%20I'm%20interested%20in%20your%20vehicles."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/30 mt-4 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              <Link 
                href="/" 
                className="text-sm font-semibold text-foreground/90 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/inventory" 
                className="text-sm font-semibold text-foreground/90 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Inventory
              </Link>

              <div className="pl-4 flex flex-col gap-1 border-l-2 border-primary/30 ml-4 my-2">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    href={`/inventory?category=${category.id}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/about" 
                className="text-sm font-semibold text-foreground/90 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <Link 
                href="/contact" 
                className="text-sm font-semibold text-foreground/90 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <Button 
                asChild
                className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-full"
              >
                <a 
                  href="https://wa.me/260977844509?text=Hello!%20I'm%20interested%20in%20your%20vehicles."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
