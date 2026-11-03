'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Gauge, Fuel, Settings, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, formatPrice } from '@/lib/cars-data'

interface CarCardProps {
  car: Car
  index?: number
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <Card 
      className="group glass border-border/30 overflow-hidden hover-lift card-glow cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/car/${car.id}`}>
        {/* Image Container */}
        <div className="relative h-52 sm:h-60 overflow-hidden img-zoom">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-semibold capitalize px-3 py-1 text-xs">
            {car.category}
          </Badge>
          
          {/* View arrow - appears on hover */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-foreground/70 font-medium mb-0.5">{car.brand}</p>
              <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {car.name}
              </h3>
            </div>
            <div className="glass-red px-4 py-2 rounded-xl">
              <span className="text-lg font-bold text-primary">{formatPrice(car.price)}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Specs Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{car.year}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{(car.mileage / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors">
              <Fuel className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground truncate w-full text-center">{car.fuelType.slice(0, 4)}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors">
              <Settings className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{car.transmission.slice(0, 4)}</span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
