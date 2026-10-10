import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { getOrderById } from '../services/api.js'

const STATUS_COLORS = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PLACED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
}

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getOrderById(id)
        setOrder(res.data.order)
      } catch {
        setError(true)
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
        <p className="mt-16 text-center text-gray-500">Loading order...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="mx-auto max-w-2xl p-6 text-center">
          <p className="text-red-500">Order not found or access denied.</p>
          <Link to="/orders" className="mt-4 inline-block rounded bg-black px-4 py-2 text-sm font-semibold text-white">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <Link to="/orders" className="text-sm text-gray-500 underline">← My Orders</Link>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-4">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-mono text-sm">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Placed on</p>
              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
              {order.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === 'PAID' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.paymentStatus}
            </span>
          </div>

          {/* Items */}
          <div className="mt-6">
            <h3 className="mb-3 font-semibold">Items</h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-lg border p-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-sm">Shipping Address</h3>
            <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
            <p className="text-sm text-gray-700">
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
            <p className="text-sm text-gray-700">📞 {order.shippingAddress.phone}</p>
          </div>

          {/* Total */}
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
