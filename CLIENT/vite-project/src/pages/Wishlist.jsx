import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WishlistCard from '../components/WishlistCard.jsx'
import { getWishlist, removeFromWishlist } from '../services/api.js'

const Wishlist = () => {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchWishlist = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getWishlist()
      setWishlist(res.data.wishlist)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
      setWishlist((prev) => prev.filter((item) => item._id !== productId))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-6xl p-6">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <p className="mb-6 text-sm text-gray-500">{wishlist.length} products saved</p>

        {loading && <p className="text-center text-gray-500">Loading your wishlist...</p>}

        {!loading && error && (
          <div className="text-center">
            <p className="mb-3 text-red-500">
              Something went wrong. We couldn't load your wishlist.
            </p>
            <button
              onClick={fetchWishlist}
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && wishlist.length === 0 && (
          <div className="text-center">
            <p className="text-3xl">❤️</p>
            <p className="mt-2 font-semibold">Your wishlist is empty</p>
            <p className="text-sm text-gray-500">
              Save products you love and find them here later.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Browse Products
            </button>
          </div>
        )}

        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist