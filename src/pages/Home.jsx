import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Card3D({ product, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateY.set(((e.clientX - cx) / rect.width) * 18)
    rotateX.set(-((e.clientY - cy) / rect.height) * 18)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const img = product.images?.[0] || ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03, zIndex: 2 }}
        onClick={() => navigate('/shop')}
      >
        {/* Image */}
        <div style={{
          width: '100%',
          aspectRatio: '3/4',
          background: '#ebebeb',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '1rem',
        }}>
          {img ? (
            <motion.img
              src={img}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'linear-gradient(135deg,#f0ede8,#e8e4de)'
            }}>
              <span style={{ fontSize: '3rem' }}>👕</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#999' }}>TRUEFIT</span>
            </div>
          )}

          {/* Shine overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none'
          }} />

          {/* NEW badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--red)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.15em', padding: '4px 10px', fontWeight: 600
          }}>
            NEW
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '0 0.25rem' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            letterSpacing: '0.2em', color: 'var(--gray)',
            marginBottom: '0.3rem', textTransform: 'uppercase'
          }}>
            {product.category || 'Essentials'}
          </p>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem',
            color: 'var(--black)', marginBottom: '0.4rem', letterSpacing: '0.03em'
          }}>
            {product.name}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            color: 'var(--red)', fontWeight: 600, letterSpacing: '0.05em'
          }}>
            BDT {product.price?.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Fallback placeholder cards when no products in DB yet
const PLACEHOLDER_PRODUCTS = [
  { id: 'p1', name: 'Oversized Essential Tee', category: 'T-Shirts', price: 850, images: [] },
  { id: 'p2', name: 'Clean Fit Jogger', category: 'Bottoms', price: 1200, images: [] },
  { id: 'p3', name: 'Minimal Hoodie', category: 'Hoodies', price: 1800, images: [] },
  { id: 'p4', name: 'Urban Cargo Pant', category: 'Bottoms', price: 1500, images: [] },
]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) setProducts(data)
        else setProducts(PLACEHOLDER_PRODUCTS)
      })
      .catch(() => setProducts(PLACEHOLDER_PRODUCTS))
  }, [])

  const displayProducts = products.length > 0 ? products : PLACEHOLDER_PRODUCTS

  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* HERO */}
      <motion.section
        style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '2rem',
          paddingBottom: '6rem', position: 'relative', overflow: 'hidden',
          y: heroY, opacity: heroOpacity
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 70% 30%, rgba(139,32,32,0.06) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--red)', letterSpacing: '0.25em',
              marginBottom: '1.5rem', fontWeight: 500
            }}
          >
            NEW COLLECTION — 2026
          </motion.p>

          {['ESSENTIAL', 'PIECES', 'FOR THE', 'MODERN'].map((word, i) => (
            <div key={word} style={{ overflow: 'hidden', marginBottom: i === 3 ? '3rem' : '0.2rem' }}>
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4.5rem, 18vw, 10rem)',
                  lineHeight: 0.9, letterSpacing: '0.02em',
                  color: i === 1 ? 'var(--red)' : 'var(--black)'
                }}
              >
                {word}
              </motion.h1>
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'var(--black)', color: 'var(--cream)',
                  padding: '1rem 2.5rem', fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                SHOP NOW <ArrowRight size={14} />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'transparent', color: 'var(--black)',
                  border: '1px solid var(--black)',
                  padding: '1rem 2.5rem', fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 500
                }}
              >
                CONTACT US
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'absolute', bottom: '2rem', right: '2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: '1px', height: '50px', background: 'var(--black)', opacity: 0.4 }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.4, writingMode: 'vertical-lr' }}>SCROLL</span>
        </motion.div>
      </motion.section>

      {/* ── FEATURED COLLECTION ── */}
      <section style={{ padding: '7rem 2rem', background: 'var(--cream)' }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.25em', marginBottom: '0.75rem' }}>
                FEATURED COLLECTION
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                color: 'var(--black)', lineHeight: 1, letterSpacing: '0.02em'
              }}>
                HAND PICKED<br />FOR YOU
              </h2>
            </div>
            <Link to="/shop" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  letterSpacing: '0.2em', color: 'var(--gray)',
                }}
              >
                VIEW ALL <ArrowRight size={13} />
              </motion.div>
            </Link>
          </div>
        </FadeUp>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '3.5rem'
        }}>
          {displayProducts.map((product, i) => (
            <Card3D key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Show More Button */}
        <FadeUp delay={0.2}>
          <div style={{ textAlign: 'center' }}>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.03, background: 'var(--black)', color: 'var(--cream)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent',
                  color: 'var(--black)',
                  border: '1.5px solid var(--black)',
                  padding: '1rem 3.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'background 0.25s, color 0.25s'
                }}
              >
                SHOW MORE <ArrowRight size={14} />
              </motion.button>
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: 'var(--black)', padding: '6rem 2rem', overflow: 'hidden' }}>
        <FadeUp>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>
            OUR STORY
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            color: 'var(--cream)', lineHeight: 1, marginBottom: '2rem'
          }}>
            BUILT ON THE IDEA<br />THAT LESS IS<br />ALWAYS MORE
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.6)', maxWidth: '500px', lineHeight: 1.8, marginBottom: '2.5rem'
          }}>
            TrueFit was born from a love of clean lines and timeless design. Every piece is selected with intention — built to last, styled to transcend trends.
          </p>
        </FadeUp>
        <FadeUp delay={0.25}>
          <Link to="/shop" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.2em', color: 'var(--cream)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7
          }}>
            EXPLORE THE COLLECTION <ArrowRight size={14} />
          </Link>
        </FadeUp>
      </section>

      {/* WHATSAPP ORDER */}
      <section style={{ padding: '7rem 2rem', background: 'var(--beige)', textAlign: 'center' }}>
        <FadeUp>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>
            EASY ORDERING
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            color: 'var(--black)', marginBottom: '1.5rem', lineHeight: 1
          }}>
            ORDER VIA<br />WHATSAPP
          </h2>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic',
            color: 'var(--gray)', marginBottom: '2.5rem', lineHeight: 1.8
          }}>
            Build your cart, then checkout directly on WhatsApp.<br />Our team handles every order personally.
          </p>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.03, background: 'var(--red-light)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'var(--red)', color: 'white',
                padding: '1.1rem 3rem', fontFamily: 'var(--font-body)',
                fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 500,
                transition: 'background 0.2s'
              }}
            >
              START SHOPPING
            </motion.button>
          </Link>
        </FadeUp>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--black)', padding: '4rem 2rem 2rem', color: 'var(--cream)' }}>
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>TRUE FIT</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(245,240,232,0.5)', fontSize: '0.95rem' }}>
            Essential pieces for the modern wardrobe.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <a href="https://www.instagram.com/true.fit90" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(245,240,232,0.5)' }}>
            INSTAGRAM
          </a>
          <a href="https://www.tiktok.com/@true.fit90" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(245,240,232,0.5)' }}>
            TIKTOK
          </a>
        </div>
        <div style={{ borderTop: '1px solid rgba(245,240,232,0.1)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>
            © 2026 TRUE FIT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
