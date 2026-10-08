import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToWishlist } from '../services/api.js'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const [wishlistStatus, setWishlistStatus] = useState('idle') // idle | saving | saved | error

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

  const renderWishlistLabel = () => {
    if (wishlistStatus === 'saving') return '⏳ Saving...'
    if (wishlistStatus === 'saved') return '♥ Added to Wishlist'
    if (wishlistStatus === 'error') return 'Unable to save. Try again.'
    return '♡ Add to Wishlist'
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
      <p className="mt-1 font-bold">₹{product.price}</p>
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