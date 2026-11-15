import type { Metadata } from 'next'
import { CartProvider } from '@/components/spares/cart-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'ALIFARIS Auto | Premium Car Dealership',
  description: 'Discover your dream car at ALIFARIS Auto. Explore our wide selection of SUVs, Coupes, Trucks, Electric vehicles, Sedans, and Luxury cars.',
  keywords: 'car dealership, auto spare, SUV, coupe, truck, electric car, sedan, luxury cars, ALIFARIS',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full max-w-[100vw] overflow-x-clip">
      <body className="font-sans antialiased w-full max-w-[100vw] overflow-x-clip">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
