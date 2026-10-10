import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PLACED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
}

const OrderCard = ({ order }) => {
  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <p className="font-mono text-xs text-gray-700">{order._id}</p>
          <p className="mt-1 text-xs text-gray-400">{dateStr}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600">
            {item.name} × {item.quantity}
          </p>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <p className="font-bold">₹{order.totalAmount.toLocaleString()}</p>
        <Link
          to={`/orders/${order._id}`}
          className="rounded bg-black px-4 py-1.5 text-xs font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default OrderCard
