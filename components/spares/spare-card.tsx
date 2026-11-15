import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ShoppingCart } from 'lucide-react'
import { formatPrice, type Spare } from '@/lib/spares-data'

export function SpareCard({ spare }: { spare: Spare }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-card/80 transition hover:-translate-y-1 hover:border-orange-500/50">
      <Link href={`/spares/${spare.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={spare.image}
            alt={spare.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-black">
            {spare.isSample ? 'Details pending' : spare.condition === 'new' ? 'New' : `Used · ${spare.grade}`}
          </span>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">{spare.category}</p>
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-foreground group-hover:text-orange-400 sm:text-base">{spare.name}</h3>
          {!spare.isSample && <p className="text-xs text-muted-foreground">Part no. {spare.partNumber}</p>}
          <div className="flex items-center justify-between gap-1 pt-1">
            <span className="text-sm font-bold text-orange-400">{spare.isSample ? 'Price on request' : formatPrice(spare.price)}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">Details <ArrowUpRight className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <Link
          href={`/spares/${spare.id}`}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-orange-500/50 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10"
          aria-label={`View ${spare.name} to add it to cart`}
        >
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </Link>
      </div>
    </article>
  )
}
