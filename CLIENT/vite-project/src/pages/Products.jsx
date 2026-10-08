import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { getAllProducts } from '../services/api.js'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(false)
      try {
        const params = {}
        if (search) params.search = search
        if (category) params.category = category

        const res = await getAllProducts(params)
        setProducts(res.data.products)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    // debounce so we don't fire a request on every keystroke
    const timer = setTimeout(fetchProducts, 400)
    return () => clearTimeout(timer)
  }, [search, category])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-6xl p-6">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        {loading && <p className="text-center text-gray-500">Loading products...</p>}

        {!loading && error && (
          <p className="text-center text-red-500">Something went wrong while loading products.</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products