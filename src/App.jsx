import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import ShaonChat from './components/ShaonChat'
import Background3D from './components/Background3D'
import LoadingScreen from './components/LoadingScreen'
import DarkModeToggle from './components/DarkModeToggle'
import NewArrivalPopup from './components/NewArrivalPopup'

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

function Layout({ children, isDark, onToggleDark }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/tf-admin-x9k2')
  return (
    <>
      {!isAdmin && <Navbar isDark={isDark} onToggleDark={onToggleDark} />}
      {children}
    </>
  )
}

function ShaonWrapper() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/tf-admin-x9k2')
  if (isAdmin) return null
  return <ShaonChat onNavigate={(path) => navigate(path)} />
}

function NewArrivalWrapper() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/tf-admin-x9k2')
  if (isAdmin) return null
  return <NewArrivalPopup />
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const saved = localStorage.getItem('truefit-dark')
    if (saved === 'true') setIsDark(true)
  }, [])

  const toggleDark = () => {
    setIsDark(prev => {
      localStorage.setItem('truefit-dark', String(!prev))
      return !prev
    })
  }

  return (
    <CartProvider>
      <LoadingScreen isLoading={isLoading} />
      <Background3D />
      <CustomCursor />
      <Layout isDark={isDark} onToggleDark={toggleDark}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tf-admin-x9k2" element={<Admin />} />
        </Routes>
      </Layout>
      <ShaonWrapper />
      <NewArrivalWrapper />
    </CartProvider>
  )
}
