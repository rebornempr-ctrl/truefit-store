import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { X } from 'lucide-react'

const CATEGORIES = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES']

function ProductCard({ product, onSelect }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(product)}
      style={{ cursor: 'none' }}
    >
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
        <div style={{
          aspectRatio: '3/4', background: 'var(--beige)',
          marginBottom: '1rem', overflow: 'hidden', position: 'relative'
        }}>
          {product.images?.[0] ? (
            <motion.img
              src={product.images[0]}
              alt={product.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, var(--beige), var(--light-gray))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', opacity: 0.15 }}>TF</span>
            </div>
          )}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--black)', marginBottom: '0.3rem' }}>
          {product.name.toUpperCase()}
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gray)' }}>
          BDT {product.price?.toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  )
}

function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!size || !color) return
    addItem(product, size, color)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--cream)', width: '100%', maxWidth: '600px',
          maxHeight: '90vh', overflow: 'auto',
          padding: '2.5rem 2rem', position: 'relative'
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          display: 'flex', alignItems: 'center'
        }}>
          <X size={20} />
        </button>

        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name}
            style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', marginBottom: '1.5rem' }} />
        )}

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--red)', marginBottom: '0.5rem' }}>
          {product.category?.toUpperCase()}
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          {product.name.toUpperCase()}
        </h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--gray)', marginBottom: '1rem' }}>
          BDT {product.price?.toLocaleString()}
        </p>
        {product.description && (
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--gray)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {product.description}
          </p>
        )}

        {/* Size */}
        {product.sizes?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '0.8rem', fontWeight: 500 }}>SIZE</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: '0.5rem 1rem', border: `1px solid ${size === s ? 'var(--black)' : 'var(--light-gray)'}`,
                  background: size === s ? 'var(--black)' : 'transparent',
                  color: size === s ? 'var(--cream)' : 'var(--black)',
                  fontSize: '0.75rem', letterSpacing: '0.1em', transition: 'all 0.2s'
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        {product.colors?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '0.8rem', fontWeight: 500 }}>COLOR</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.colors.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  padding: '0.5rem 1rem', border: `1px solid ${color === c ? 'var(--black)' : 'var(--light-gray)'}`,
                  background: color === c ? 'var(--black)' : 'transparent',
                  color: color === c ? 'var(--cream)' : 'var(--black)',
                  fontSize: '0.75rem', letterSpacing: '0.1em', transition: 'all 0.2s'
                }}>{c}</button>
              ))}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleAdd}
          disabled={!size || !color}
          style={{
            width: '100%', padding: '1.1rem',
            background: added ? 'var(--red)' : (!size || !color) ? 'var(--light-gray)' : 'var(--black)',
            color: 'var(--cream)',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.2em', fontWeight: 500, transition: 'background 0.3s'
          }}
        >
          {added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function Shop() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('ALL')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = category === 'ALL' ? products : products.filter(p => p.category?.toUpperCase() === category)

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.25em', marginBottom: '0.8rem' }}
        >
          FEATURED
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '2rem' }}
        >
          NEW ARRIVALS
        </motion.h1>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid var(--light-gray)', marginBottom: '2.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '1rem 1.2rem', fontFamily: 'var(--font-body)',
                fontSize: '0.7rem', letterSpacing: '0.15em', whiteSpace: 'nowrap',
                color: category === cat ? 'var(--black)' : 'var(--gray)',
                borderBottom: category === cat ? '2px solid var(--black)' : '2px solid transparent',
                transition: 'all 0.2s', background: 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '0 2rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i}>
                <div style={{ aspectRatio: '3/4', background: 'var(--beige)', marginBottom: '1rem',
                  animation: 'pulse 1.5s infinite', opacity: 0.6 }} />
                <div style={{ height: '12px', background: 'var(--beige)', marginBottom: '0.5rem', width: '70%' }} />
                <div style={{ height: '12px', background: 'var(--beige)', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', opacity: 0.3 }}>NO PRODUCTS YET</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
