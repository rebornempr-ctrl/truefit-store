import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, LogOut, Package, MessageSquare, Eye, EyeOff } from 'lucide-react'

const ADMIN_PASSWORD = 'truefit2026admin'

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tf_admin', '1')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>TRUE FIT</p>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--gray)', marginBottom: '3rem' }}>Admin Panel</p>

        <div style={{ background: 'white', padding: '2.5rem', boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
          <Package size={32} strokeWidth={1} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '1.5rem', color: 'var(--gray)' }}>ADMIN ACCESS REQUIRED</p>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.9rem 3rem 0.9rem 1rem',
                border: `1px solid ${error ? 'var(--red)' : 'var(--light-gray)'}`,
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button onClick={() => setShow(!show)} style={{
              position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4
            }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '0.75rem', color: 'var(--red)', marginBottom: '1rem' }}>
              Wrong password
            </motion.p>
          )}

          <button onClick={handleLogin} style={{
            width: '100%', padding: '1rem',
            background: 'var(--black)', color: 'var(--cream)',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.2em'
          }}>
            SIGN IN
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('tf_admin'))
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', price: '', category: 'Tops', description: '',
    sizes: 'XS, S, M, L, XL', colors: 'Black, White', images: ''
  })

  useEffect(() => {
    if (authed) {
      fetchProducts()
      fetchMessages()
    }
  }, [authed])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
  }

  const handleAdd = async () => {
    if (!form.name || !form.price) return
    setLoading(true)
    const { error } = await supabase.from('products').insert([{
      name: form.name,
      price: parseInt(form.price),
      category: form.category,
      description: form.description,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      images: form.images.split(',').map(i => i.trim()).filter(Boolean)
    }])
    if (!error) {
      setForm({ name: '', price: '', category: 'Tops', description: '', sizes: 'XS, S, M, L, XL', colors: 'Black, White', images: '' })
      setShowForm(false)
      fetchProducts()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const logout = () => {
    sessionStorage.removeItem('tf_admin')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Admin Navbar */}
      <div style={{
        background: 'white', padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--light-gray)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>TRUE FIT — ADMIN</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--gray)' }}>VIEW SITE</a>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', letterSpacing: '0.15em', padding: '0.6rem 1rem', border: '1px solid var(--light-gray)' }}>
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[{ key: 'products', label: 'PRODUCTS', icon: Package }, { key: 'messages', label: 'MESSAGES', icon: MessageSquare }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em',
              background: tab === t.key ? 'var(--black)' : 'transparent',
              color: tab === t.key ? 'var(--cream)' : 'var(--black)',
              border: '1px solid var(--light-gray)', transition: 'all 0.2s'
            }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gray)' }}>{products.length} PRODUCTS</p>
              <button onClick={() => setShowForm(true)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 1.5rem', background: 'var(--black)', color: 'var(--cream)',
                fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em'
              }}>
                <Plus size={14} /> ADD PRODUCT
              </button>
            </div>

            {/* Product list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {products.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 0', borderBottom: '1px solid var(--light-gray)'
                }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} style={{ width: '50px', height: '60px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '50px', height: '60px', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>TF</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{p.name.toUpperCase()}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>BDT {p.price?.toLocaleString()} · {p.category}</p>
                  </div>
                  <button onClick={() => handleDelete(p.id)} style={{ opacity: 0.4 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--gray)', padding: '2rem 0' }}>No messages yet.</p>
            ) : messages.map(m => (
              <div key={m.id} style={{ padding: '1.2rem', background: 'white', borderLeft: '3px solid var(--red)' }}>
                <p style={{ fontWeight: 500, marginBottom: '0.3rem', fontSize: '0.85rem' }}>{m.name}</p>
                {m.phone && <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: '0.3rem' }}>{m.phone}</p>}
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--cream)', width: '100%', padding: '2rem', maxHeight: '90vh', overflow: 'auto' }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>ADD NEW PRODUCT</p>

              {[
                { label: 'NAME', key: 'name', placeholder: 'Product name' },
                { label: 'PRICE (BDT)', key: 'price', placeholder: '3500' },
                { label: 'DESCRIPTION', key: 'description', placeholder: 'Product description...' },
                { label: 'SIZES (COMMA SEPARATED)', key: 'sizes', placeholder: 'XS, S, M, L, XL' },
                { label: 'COLORS (COMMA SEPARATED)', key: 'colors', placeholder: 'Black, White, Beige' },
                { label: 'IMAGE URLS (COMMA SEPARATED)', key: 'images', placeholder: 'https://i.ibb.co/...' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '1.2rem' }}>
                  <label style={{ fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>{field.label}</label>
                  {field.key === 'description' ? (
                    <textarea value={form[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} rows={3}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--light-gray)', background: 'white', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
                  ) : (
                    <input value={form[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--light-gray)', background: 'white', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }} />
                  )}
                </div>
              ))}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>CATEGORY</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--light-gray)', background: 'white', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }}>
                  {['Tops', 'Bottoms', 'Outerwear', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleAdd} disabled={loading} style={{
                  flex: 1, padding: '1rem', background: 'var(--black)', color: 'var(--cream)',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.15em'
                }}>
                  {loading ? 'SAVING...' : 'ADD PRODUCT'}
                </button>
                <button onClick={() => setShowForm(false)} style={{
                  padding: '1rem 1.5rem', border: '1px solid var(--light-gray)',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.15em'
                }}>
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
