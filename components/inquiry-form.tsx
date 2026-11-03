'use client'

import { useState } from 'react'
import { MessageCircle, Mail, User, Phone, Check } from 'lucide-react'
import { Car, formatPrice } from '@/lib/cars-data'

interface InquiryFormProps {
  car: Car
}

const WHATSAPP_NUMBER = '260977844509'
const EMAIL_ADDRESS = 'sichulaj03@gmail.com'

export function InquiryForm({ car }: InquiryFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${car.year} ${car.brand} ${car.name} listed at ${formatPrice(car.price)}. Please contact me with more details.`
  )
  const [sent, setSent] = useState<'whatsapp' | 'email' | null>(null)

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `*VEHICLE INQUIRY - ALIFARISO Auto Spare*\n\n` +
      `Name: ${name || '(not provided)'}\n` +
      `Email: ${email || '(not provided)'}\n` +
      `Phone: ${phone || '(not provided)'}\n\n` +
      `Vehicle: ${car.year} ${car.brand} ${car.name}\n` +
      `Price: ${formatPrice(car.price)}\n\n` +
      `Message: ${message}`
    )
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(url, '_blank')
    setSent('whatsapp')
  }

  function handleEmail() {
    const subject = encodeURIComponent(`Inquiry: ${car.year} ${car.brand} ${car.name}`)
    const body = encodeURIComponent(
      `Name: ${name || '(not provided)'}\n` +
      `Email: ${email || '(not provided)'}\n` +
      `Phone: ${phone || '(not provided)'}\n\n` +
      `Vehicle: ${car.year} ${car.brand} ${car.name}\n` +
      `Price: ${formatPrice(car.price)}\n\n` +
      `Message: ${message}`
    )
    window.open(`mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`)
    setSent('email')
  }

  if (sent) {
    return (
      <div className="glass border border-border/30 rounded-2xl p-10 text-center card-glow">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          {sent === 'whatsapp' ? 'WhatsApp Opened!' : 'Email App Opened!'}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          {sent === 'whatsapp'
            ? "Your message is ready in WhatsApp — just hit Send!"
            : "Your email is ready — check your email app!"}
        </p>
        <button
          onClick={() => setSent(null)}
          className="px-6 py-3 rounded-full border border-border/50 text-foreground hover:bg-primary/5 transition-colors text-sm font-medium"
        >
          Send Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <div className="glass border border-border/30 rounded-2xl overflow-hidden card-glow">
      <div className="bg-primary/5 border-b border-border/30 px-8 py-5">
        <h3 className="text-xl font-bold text-foreground">Interested in this vehicle?</h3>
        <p className="text-sm text-muted-foreground mt-1">Fill in your details and choose how to send your inquiry.</p>
      </div>

      <div className="px-8 py-6 space-y-5">

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" /> Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+260 977 000 000"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none"
          />
        </div>

        <div className="pt-2 space-y-3">

          {/* WhatsApp — button wrapping an anchor */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => { e.preventDefault(); handleWhatsApp() }}
            style={{ display: 'flex', width: '100%', height: '56px', borderRadius: '9999px', backgroundColor: '#25D366', color: '#fff', fontWeight: 600, fontSize: '1rem', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}
          >
            <MessageCircle style={{ width: '20px', height: '20px' }} />
            Send via WhatsApp
          </a>

          {/* Email — button wrapping an anchor */}
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            onClick={e => { e.preventDefault(); handleEmail() }}
            style={{ display: 'flex', width: '100%', height: '56px', borderRadius: '9999px', backgroundColor: '#dc2626', color: '#fff', fontWeight: 600, fontSize: '1rem', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}
          >
            <Mail style={{ width: '20px', height: '20px' }} />
            Send via Email
          </a>

        </div>

        <p className="text-xs text-center text-muted-foreground pt-1">
          WhatsApp: +260 977 844 509 &nbsp;·&nbsp; Email: {EMAIL_ADDRESS}
        </p>
      </div>
    </div>
  )
}
