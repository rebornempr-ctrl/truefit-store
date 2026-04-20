import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, size, color) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size && i.color === color)
      if (existing) {
        return prev.map(i => i.id === product.id && i.size === size && i.color === color
          ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, size, color, quantity: 1, cartId: `${product.id}-${size}-${color}` }]
    })
  }

  const removeItem = (cartId) => setItems(prev => prev.filter(i => i.cartId !== cartId))

  const updateQty = (cartId, qty) => {
    if (qty <= 0) return removeItem(cartId)
    setItems(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i))
  }

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
