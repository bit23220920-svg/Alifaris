import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSection } from '@/components/featured-section'
import { CategoriesSection } from '@/components/categories-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { SparesHomeTeaser } from '@/components/spares/home-teaser'
import { listCars } from '@/lib/catalog-repository'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const cars = await listCars()
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection cars={cars} />
      <FeaturedSection cars={cars} />
      <CategoriesSection cars={cars} />
      <SparesHomeTeaser />
      <CTASection />
      <Footer />
    </main>
  )
}
