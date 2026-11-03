import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSection } from '@/components/featured-section'
import { CategoriesSection } from '@/components/categories-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
