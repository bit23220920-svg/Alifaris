import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SparesBrowser } from '@/components/spares/spares-browser'
import { listSpares } from '@/lib/catalog-repository'
import { isTursoConfigured } from '@/lib/turso'

export const metadata = {
  title: 'Auto Spares | ALIFARIS Auto',
  description: 'Browse auto spares and find parts compatible with your vehicle.',
}

export const dynamic = 'force-dynamic'

export default async function SparesPage() {
  const spares = await listSpares()
  const hasPendingDetails = !isTursoConfigured() || spares.some((spare) => spare.isSample)
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <header className="relative isolate overflow-hidden px-4 pb-10 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-4/5 lg:w-[62%]" aria-hidden="true">
          <Image
            src="/assets/sparesimage.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 62vw"
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-transparent" aria-hidden="true" />
        <div className="container relative z-10 mx-auto">
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-orange-400">ALIFARIS Auto Spares</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">The right part for your next drive.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">Browse parts, check vehicle compatibility, and send your order request on WhatsApp.</p>
          {hasPendingDetails && (
            <p className="mt-4 inline-flex rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm text-orange-200">Some part details, prices, and vehicle fitments are being confirmed. Contact us before ordering.</p>
          )}
        </div>
      </header>
      <SparesBrowser allSpares={spares} />
      <Footer />
    </main>
  )
}
