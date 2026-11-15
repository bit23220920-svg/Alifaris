'use client'

import { useState } from 'react'
import { MessageCircle, Mail, User, Phone, Check } from 'lucide-react'

const WHATSAPP_NUMBER = '260977844509'
const EMAIL_ADDRESS = 'sichulaj03@gmail.com'

export default function InquiryForm({ car }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(null)

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Vehicle Inquiry\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n\n` +
      `Vehicle: ${car.year} ${car.brand} ${car.name}\n` +
      `Message: ${message}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setSent('whatsapp')
    setTimeout(() => setSent(null), 3000)
  }

  function handleEmail() {
    const subject = encodeURIComponent(`Inquiry: ${car.year} ${car.brand} ${car.name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nVehicle: ${car.year} ${car.brand} ${car.name}\n\nMessage: ${message}`
    )
    window.open(`mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`, '_blank')
    setSent('email')
    setTimeout(() => setSent(null), 3000)
  }

  if (sent) {
    return (
      <div className="glass border rounded-2xl p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          {sent === 'whatsapp' ? 'WhatsApp Opened!' : 'Email Opened!'}
        </h3>
        <button
          onClick={() => setSent(null)}
          className="px-6 py-3 rounded-full border"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <div className="glass border rounded-2xl overflow-hidden">
      <div className="bg-primary/5 border-b px-8 py-5">
        <h3 className="text-xl font-bold">Interested in this vehicle?</h3>
        <p className="text-sm mt-1">Fill out the form below</p>
      </div>

      <div className="px-4 py-5 space-y-4 sm:px-8 sm:py-6 sm:space-y-5">
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <User className="w-4 h-4" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              console.log('Name changed:', e.target.value)
              setName(e.target.value)
            }}
            placeholder="John Doe"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border"
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('Email changed:', e.target.value)
              setEmail(e.target.value)
            }}
            placeholder="john@example.com"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border"
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4" /> Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              console.log('Phone changed:', e.target.value)
              setPhone(e.target.value)
            }}
            placeholder="+260 977 000 000"
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Message</label>
          <textarea
            value={message}
            onChange={(e) => {
              console.log('Message changed:', e.target.value)
              setMessage(e.target.value)
            }}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border resize-none"
            placeholder={`Hi, I'm interested in the ${car.year} ${car.brand} ${car.name}`}
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </button>

          <button
            onClick={handleEmail}
            className="w-full h-14 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Email
          </button>
        </div>
      </div>
    </div>
  )
}
