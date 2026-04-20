import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart()

  const whatsappMsg = encodeURIComponent(
    `Hi TrueFit! I'd like to order:\n\n` +
    items.map(i => `• ${i.name} | Size: ${i.size} | Color: ${i.color} | Qty: ${i.quantity} | BDT ${(i.price * i.quantity).toLocaleString()}`).join('\n') +
    `\n\nTotal: BDT ${total.toLocaleString()}`
  )

  return (
    <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--cream)', padding: '8rem 2rem 4rem' }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '3rem' }}
      >
        YOUR CART
      </motion.h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '5rem 0' }}
        >
          <ShoppingBag size={40} strokeWidth={1} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', opacity: 0.3, marginBottom: '2rem' }}>YOUR CART IS EMPTY</p>
          <Link to="/shop">
            <button style={{
              background: 'var(--black)', color: 'var(--cream)',
              padding: '1rem 2.5rem', fontFamily: 'var(--font-body)',
              fontSize: '0.75rem', letterSpacing: '0.2em'
            }}>
              SHOP NOW
            </button>
          </Link>
        </motion.div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.cartId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  style={{
                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    padding: '1.5rem 0', borderBottom: '1px solid var(--light-gray)'
                  }}
                >
                  {item.images?.[0] && (
                    <img src={item.images[0]} alt={item.name}
                      style={{ width: '80px', height: '100px', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                      {item.name.toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: '0.2rem' }}>
                      {item.size} / {item.color}
                    </p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '1rem' }}>
                      BDT {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <button onClick={() => updateQty(item.cartId, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.cartId, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeItem(item.cartId)} style={{ marginLeft: '0.5rem', opacity: 0.4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>TOTAL</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>BDT {total.toLocaleString()}</span>
            </div>
            <a href={`https://wa.me/8801605086090?text=${whatsappMsg}`} target="_blank" rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: '100%', padding: '1.2rem',
                  background: '#25D366', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  letterSpacing: '0.2em', fontWeight: 500, marginBottom: '1rem'
                }}
              >
                CHECKOUT ON WHATSAPP
              </motion.button>
            </a>
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--gray)', fontStyle: 'italic' }}>
              Free shipping on orders over BDT 5,000
            </p>
          </div>
        </>
      )}
    </div>
  )
}
