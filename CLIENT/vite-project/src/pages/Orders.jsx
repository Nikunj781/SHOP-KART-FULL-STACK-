import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import OrderCard from '../components/OrderCard.jsx'
import { getOrders } from '../services/api.js'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getOrders()
      setOrders(res.data.orders)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="mb-6 text-2xl font-bold">My Orders</h2>

        {/* Loading */}
        {loading && <p className="text-center text-gray-500">Loading your orders...</p>}

        {/* Error */}
        {!loading && error && (
          <div className="text-center">
            <p className="mb-3 text-red-500">Unable to load your orders.</p>
            <button
              onClick={fetchOrders}
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl">📦</p>
            <p className="mt-3 text-lg font-semibold">No orders yet</p>
            <p className="mt-1 text-sm text-gray-500">
              You have not placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
