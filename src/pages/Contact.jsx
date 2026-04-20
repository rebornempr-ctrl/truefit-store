import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { ArrowUpRight } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.message) return
    setLoading(true)
    await supabase.from('messages').insert([form])
    setSent(true)
    setLoading(false)
  }

  const whatsappMsg = encodeURIComponent(`Hi TrueFit! I'd like to place an order.\n\nName: ${form.name}\n\nMessage: ${form.message}`)

  return (
    <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--cream)', padding: '8rem 2rem 4rem' }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.25em', marginBottom: '1rem' }}
      >
        GET IN TOUCH
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: '3rem', lineHeight: 1 }}
      >
        CONTACT<br />US
      </motion.h1>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}
      >
        <a href="https://www.instagram.com/true.fit90" target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
          <span>📷</span>
          @TRUE.FIT90
          <ArrowUpRight size={14} opacity={0.4} />
        </a>
        <a href="https://www.tiktok.com/@true.fit90" target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
          <span style={{ fontSize: '1rem' }}>♪</span>
          @TRUE.FIT90
          <ArrowUpRight size={14} opacity={0.4} />
        </a>
        <a href="https://wa.me/8801605086090" target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
          <span>💬</span>
          +880 1605 086090
          <ArrowUpRight size={14} opacity={0.4} />
        </a>
      </motion.div>

      {/* Form */}
      {!sent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
        >
          {[
            { label: 'YOUR NAME', key: 'name', type: 'text', placeholder: 'Enter your name' },
            { label: 'PHONE NUMBER', key: 'phone', type: 'tel', placeholder: '+880 ...' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                style={{
                  width: '100%', padding: '0.9rem 1rem',
                  border: '1px solid var(--light-gray)', background: 'transparent',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--black)'}
                onBlur={e => e.target.style.borderColor = 'var(--light-gray)'}
              />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
              MESSAGE
            </label>
            <textarea
              placeholder="What are you looking for?"
              value={form.message}
              onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              style={{
                width: '100%', padding: '0.9rem 1rem',
                border: '1px solid var(--light-gray)', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                resize: 'vertical', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--light-gray)'}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: '1rem',
                background: 'var(--black)', color: 'var(--cream)',
                fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.2em'
              }}
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </motion.button>
            <a href={`https://wa.me/8801605086090?text=${whatsappMsg}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: '100%', padding: '1rem',
                  background: '#25D366', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.2em'
                }}
              >
                ORDER ON WHATSAPP
              </motion.button>
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '3rem 0' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>MESSAGE SENT ✓</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--gray)' }}>
            We'll get back to you shortly.
          </p>
        </motion.div>
      )}
    </div>
  )
}
