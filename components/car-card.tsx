'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Gauge, Fuel, Settings, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Car, formatPrice } from '@/lib/cars-data'

export interface CarCardProps {
  car: Car
  index?: number
}


export function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group glass border-border/30 overflow-hidden hover-lift card-glow cursor-pointer animate-fade-in-up active:scale-[0.98]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/car/${car.id}`}>
        {/* Image Container */}
        <div className="relative h-36 overflow-hidden img-zoom sm:h-40 lg:h-44">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <Badge className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-xs font-semibold capitalize">
            {car.category}
          </Badge>
          
          {/* View arrow - appears on hover */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start justify-between gap-1 lg:bottom-4 lg:left-4 lg:right-4 lg:flex-row lg:items-end lg:gap-2">
            <div>
              <p className="text-xs text-foreground/70 font-medium mb-0.5">{car.brand}</p>
              <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors sm:text-base lg:text-lg">
                {car.name}
              </h3>
            </div>
            <div className="glass-red rounded-lg px-2.5 py-1 lg:rounded-xl lg:px-3 lg:py-1.5">
              <span className="text-sm font-bold text-primary sm:text-base">{formatPrice(car.price)}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-secondary/50 p-2 transition-colors group-hover:bg-secondary sm:gap-1.5 sm:p-2.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{car.year}</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-secondary/50 p-2 transition-colors group-hover:bg-secondary sm:gap-1.5 sm:p-2.5">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{(car.mileage / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-secondary/50 p-2 transition-colors group-hover:bg-secondary sm:gap-1.5 sm:p-2.5">
              <Fuel className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground truncate w-full text-center">{car.fuelType.slice(0, 4)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-secondary/50 p-2 transition-colors group-hover:bg-secondary sm:gap-1.5 sm:p-2.5">
              <Settings className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{car.transmission.slice(0, 4)}</span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-2 flex min-h-11 items-center justify-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-primary">
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </CardContent>
      </Link>
    </motion.div>
  )
}
