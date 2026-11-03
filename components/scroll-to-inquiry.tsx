'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScrollToInquiryProps {
  carName: string
}

export function ScrollToInquiry({ carName }: ScrollToInquiryProps) {
  const handleClick = () => {
    const el = document.getElementById('inquiry-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground gap-3 shadow-lg shadow-primary/20"
    >
      <MessageCircle className="w-5 h-5" />
      Enquire About This {carName}
    </Button>
  )
}
