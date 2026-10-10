import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart, addToCart, removeFromCart, updateCartQuantity } from '../services/api.js'
import { useAuth } from './authContext.jsx'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { customer } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState(false)

  // Derived values
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const fetchCart = useCallback(async () => {
    setCartLoading(true)
    setCartError(false)
    try {
      const res = await getCart()
      setCartItems(res.data.cart)
    } catch (err) {
      setCartError(true)
    } finally {
      setCartLoading(false)
    }
  }, [])

  // Load cart when customer logs in
  useEffect(() => {
    if (customer) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [customer, fetchCart])

  const handleAddToCart = async (productId) => {
    const res = await addToCart(productId)
    // Re-fetch to get populated product data
    await fetchCart()
    return res
  }

  const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId)
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId))
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    await updateCartQuantity(productId, quantity)
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        cartCount,
        cartSubtotal,
        fetchCart,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

