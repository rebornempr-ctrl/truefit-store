import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function NewArrivalPopup() {
  const [show, setShow] = useState(false)
  const [product, setProduct] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (dismissed) return

    // Fetch newest product
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProduct(data[0])
        }
      })

    // Show after 5 seconds
    const t = setTimeout(() => setShow(true), 5000)

    // Auto hide after 8 seconds
    const t2 = setTimeout(() => setShow(false), 13000)

    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [dismissed])

  const handleClick = () => {
    setShow(false)
    setDismissed(true)
    navigate('/shop')
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setShow(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: 90,
            left: 20,
            zIndex: 9997,
            background: 'var(--black)',
            color: 'var(--cream)',
            borderRadius: 16,
            padding: '14px 16px',
            width: 260,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {/* Image or icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: '#8B2020', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', overflow: 'hidden',
          }}>
            {product?.images?.[0]
              ? <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '👕'
            }
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 3,
            }}>
              <span style={{
                background: '#8B2020', color: '#fff',
                fontSize: '0.55rem', fontFamily: 'var(--font-body)',
                letterSpacing: '0.15em', padding: '2px 7px',
                borderRadius: 4, fontWeight: 600,
              }}>
                NEW ARRIVAL
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--cream)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              marginBottom: 2,
            }}>
              {product?.name || 'Fresh Drop Just Landed!'}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'rgba(245,240,232,0.55)',
            }}>
              Tap to see it in shop →
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(245,240,232,0.4)',
              fontSize: '0.9rem', cursor: 'none',
              flexShrink: 0, alignSelf: 'flex-start',
              padding: 0,
            }}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
