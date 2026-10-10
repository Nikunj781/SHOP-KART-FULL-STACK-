import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToWishlist } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { handleAddToCart } = useCart()
  const [wishlistStatus, setWishlistStatus] = useState('idle') // idle | saving | saved | error
  const [cartStatus, setCartStatus] = useState('idle') // idle | adding | added | error

  const handleAddToWishlist = async () => {
    if (wishlistStatus === 'saving' || wishlistStatus === 'saved') return

    setWishlistStatus('saving')
    try {
      await addToWishlist(product._id)
      setWishlistStatus('saved')
    } catch (err) {
      setWishlistStatus('error')
    }
  }

  const handleCart = async () => {
    if (cartStatus === 'adding') return
    setCartStatus('adding')
    try {
      await handleAddToCart(product._id)
      setCartStatus('added')
      // Reset after 2s so the button is usable again
      setTimeout(() => setCartStatus('idle'), 2000)
    } catch (err) {
      setCartStatus('error')
      setTimeout(() => setCartStatus('idle'), 2000)
    }
  }

  const renderWishlistLabel = () => {
    if (wishlistStatus === 'saving') return '⏳ Saving...'
    if (wishlistStatus === 'saved') return '♥ Added to Wishlist'
    if (wishlistStatus === 'error') return 'Unable to save. Try again.'
    return '♡ Add to Wishlist'
  }

  const renderCartLabel = () => {
    if (cartStatus === 'adding') return 'Adding...'
    if (cartStatus === 'added') return '✓ Added to Cart'
    if (cartStatus === 'error') return 'Error. Try again.'
    return '🛒 Add to Cart'
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="mb-3 h-40 w-full rounded-lg object-cover"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-1 font-bold">₹{product.price.toLocaleString()}</p>
      <p className="text-xs text-gray-500">
        {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
      </p>

      <button
        onClick={() => navigate(`/products/${product._id}`)}
        className="mt-3 w-full rounded bg-black py-1.5 text-sm font-semibold text-white"
      >
        View Details
      </button>

      <button
        onClick={handleCart}
        disabled={cartStatus === 'adding' || product.stock === 0}
        className="mt-2 w-full rounded bg-gray-800 py-1.5 text-sm font-semibold text-white disabled:opacity-70"
      >
        {renderCartLabel()}
      </button>

      <button
        onClick={handleAddToWishlist}
        disabled={wishlistStatus === 'saving' || wishlistStatus === 'saved'}
        className="mt-2 w-full rounded border py-1.5 text-sm font-semibold text-gray-700 disabled:opacity-70"
      >
        {renderWishlistLabel()}
      </button>
    </div>
  )
}

export default ProductCard