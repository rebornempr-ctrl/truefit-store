import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: '#0A0A0A',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2rem'
          }}
        >
          {/* Logo */}
          <div style={{ overflow: 'hidden' }}>
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 12vw, 6rem)',
                color: '#F5F0E8',
                letterSpacing: '0.15em',
                lineHeight: 1,
              }}
            >
              TRUE FIT
            </motion.p>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#F5F0E8',
              letterSpacing: '0.1em',
            }}
          >
            Essential pieces for the modern wardrobe.
          </motion.p>

          {/* Progress bar */}
          <motion.div
            style={{
              width: '120px', height: '1px',
              background: 'rgba(245,240,232,0.15)',
              position: 'relative', overflow: 'hidden',
              borderRadius: '1px',
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', inset: 0,
                background: '#8B2020',
              }}
            />
          </motion.div>

          {/* Red dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: '#8B2020',
              position: 'absolute',
              bottom: '2.5rem',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
