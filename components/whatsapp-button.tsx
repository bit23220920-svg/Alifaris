'use client'

import { MessageCircle } from 'lucide-react'

// CONTACT CONFIGURATION
const WHATSAPP_NUMBER = '260977844509'
export function WhatsAppButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      aria-label="Contact us on WhatsApp"
      onClick={handleClick}
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 hidden sm:block whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity sm:opacity-0 sm:group-hover:opacity-100 pointer-events-none">
        Chat with us
      </span>
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
    </a>
  )
}
