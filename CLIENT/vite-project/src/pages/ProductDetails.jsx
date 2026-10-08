import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { getProductById } from '../services/api.js'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await getProductById(id)
        setProduct(res.data.product)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-3xl p-6">
        {loading && <p className="text-center text-gray-500">Loading product...</p>}

        {!loading && error && (
          <p className="text-center text-red-500">Something went wrong while loading the product.</p>
        )}

        {!loading && !error && product && (
          <div className="rounded-xl bg-white p-6 shadow">
            <img
              src={product.image}
              alt={product.name}
              className="mb-4 h-72 w-full rounded-lg object-cover"
            />
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
            <p className="mt-3 text-gray-700">{product.description}</p>
            <p className="mt-4 text-xl font-bold">₹{product.price}</p>
            <p className="text-sm text-gray-500">
              {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
            </p>
            <button className="mt-5 w-full rounded bg-black py-2 font-semibold text-white">
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails