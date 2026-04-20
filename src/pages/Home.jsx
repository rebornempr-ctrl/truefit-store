import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

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
        {/* Background texture */}
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

          <div style={{ overflow: 'hidden', marginBottom: '0.2rem' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.5rem, 18vw, 10rem)',
                lineHeight: 0.9, letterSpacing: '0.02em',
                color: 'var(--black)'
              }}
            >
              ESSENTIAL
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '0.2rem' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.5rem, 18vw, 10rem)',
                lineHeight: 0.9, letterSpacing: '0.02em',
                color: 'var(--red)'
              }}
            >
              PIECES
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '0.2rem' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.5rem, 18vw, 10rem)',
                lineHeight: 0.9, letterSpacing: '0.02em',
                color: 'var(--black)'
              }}
            >
              FOR THE
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.5rem, 18vw, 10rem)',
                lineHeight: 0.9, letterSpacing: '0.02em',
                color: 'var(--black)'
              }}
            >
              MODERN
            </motion.h1>
          </div>

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

        {/* Scroll indicator */}
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
