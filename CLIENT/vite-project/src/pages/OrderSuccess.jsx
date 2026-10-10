import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { getOrderById } from '../services/api.js'

const OrderSuccess = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrderById(id)
        setOrder(res.data.order)
      } catch {
        // If fetch fails, still show minimal confirmation with the id
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="mt-16 text-center text-gray-500">Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
          <p className="text-5xl">✅</p>
          <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>

          <div className="mt-6 text-left text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-medium">Order ID:</span>{' '}
              <span className="font-mono text-xs">{id}</span>
            </p>
            {order && (
              <>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  ₹{order.totalAmount.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment:</span>{' '}
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {order.paymentStatus}
                  </span>
                </p>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Your order has been saved and will be processed shortly.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/orders"
              className="block w-full rounded bg-black py-2 text-sm font-semibold text-white"
            >
              View My Orders
            </Link>
            <button
              onClick={() => navigate('/products')}
              className="w-full rounded border py-2 text-sm font-semibold text-gray-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
