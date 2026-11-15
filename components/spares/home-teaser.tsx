import Link from 'next/link'
import { ArrowRight, Wrench } from 'lucide-react'

export function SparesHomeTeaser() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-card to-card p-6 sm:p-10">
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1.5 text-sm font-bold text-orange-300">
              <Wrench className="h-4 w-4" /> ALIFARIS Auto Spares
            </div>
            <h2 className="text-2xl font-black sm:text-3xl">Looking for a part?</h2>
            <p className="mt-2 text-muted-foreground">Browse parts and find compatible items for your vehicle.</p>
          </div>
          <Link href="/spares" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-5 font-bold text-black transition hover:bg-orange-400">
            Shop spares <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
