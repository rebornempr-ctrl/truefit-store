import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Menu } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { items } = useCart()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0.8rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s ease'
        }}
      >
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.15em', color: 'var(--black)' }}>
          TRUE FIT
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/cart" style={{ position: 'relative' }} onClick={() => {}}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--red)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600
                }}
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center' }}>
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'var(--black)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', justifyContent: 'center',
              padding: '4rem 2.5rem'
            }}
          >
            {[
              { label: 'HOME', to: '/' },
              { label: 'SHOP', to: '/shop' },
              { label: 'CONTACT', to: '/contact' },
            ].map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={item.to}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3rem, 10vw, 6rem)',
                    color: 'var(--cream)',
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                    display: 'block',
                    marginBottom: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--red)'}
                  onMouseLeave={e => e.target.style.color = 'var(--cream)'}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}
            >
              <a href="https://www.instagram.com/true.fit90" target="_blank" rel="noreferrer"
                style={{ color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
                INSTAGRAM
              </a>
              <a href="https://www.tiktok.com/@true.fit90" target="_blank" rel="noreferrer"
                style={{ color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
                TIKTOK
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
