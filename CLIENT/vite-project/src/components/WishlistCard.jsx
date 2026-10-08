import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate()
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    await onRemove(product._id)
    setRemoving(false)
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
        onClick={handleRemove}
        disabled={removing}
        className="mt-2 w-full rounded border border-red-300 py-1.5 text-sm font-semibold text-red-600 disabled:opacity-60"
      >
        {removing ? 'Removing...' : 'Remove ♥'}
      </button>
    </div>
  )
}

export default WishlistCard