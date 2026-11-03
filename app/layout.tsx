import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'ALIFARISO Auto Spare | Premium Car Dealership',
  description: 'Discover your dream car at ALIFARISO Auto Spare. Explore our wide selection of SUVs, Coupes, Trucks, Electric vehicles, Sedans, and Luxury cars.',
  keywords: 'car dealership, auto spare, SUV, coupe, truck, electric car, sedan, luxury cars, ALIFARISO',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
