import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [follow, setFollow] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    let raf
    const animate = () => {
      setFollow(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12
      }))
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [pos])

  return (
    <>
      <div className="cursor" style={{ left: pos.x, top: pos.y }} />
      <div className="cursor-follower" style={{ left: follow.x, top: follow.y }} />
    </>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/tf-admin-x9k2')
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <CustomCursor />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          {/* SECRET ADMIN ROUTE — don't share this URL */}
          <Route path="/tf-admin-x9k2" element={<Admin />} />
        </Routes>
      </Layout>
    </CartProvider>
  )
}
