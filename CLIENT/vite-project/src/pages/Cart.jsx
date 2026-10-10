import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import CartItem from '../components/CartItem.jsx'
import { useCart } from '../context/CartContext.jsx'

const Cart = () => {
  const navigate = useNavigate()
  const {
    cartItems,
    cartLoading,
    cartError,
    cartSubtotal,
    fetchCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
  } = useCart()

  const handleIncrease = async (productId, currentQty, stock) => {
    if (currentQty >= stock) return
    try {
      await handleUpdateQuantity(productId, currentQty + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecrease = async (productId, currentQty) => {
    if (currentQty <= 1) return
    try {
      await handleUpdateQuantity(productId, currentQty - 1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await handleRemoveFromCart(productId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-2xl font-bold">My Cart</h2>

        {/* Loading state */}
        {cartLoading && (
          <p className="text-center text-gray-500">Loading your cart...</p>
        )}

        {/* Error state */}
        {!cartLoading && cartError && (
          <div className="text-center">
            <p className="mb-3 text-red-500">Unable to load your cart.</p>
            <button
              onClick={fetchCart}
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!cartLoading && !cartError && cartItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl">🛒</p>
            <p className="mt-3 text-lg font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-gray-500">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Cart items + Order summary */}
        {!cartLoading && !cartError && cartItems.length > 0 && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Items list */}
            <div className="flex flex-1 flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-72">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    Items: {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-3 mt-2">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-5 w-full rounded bg-black py-2 text-sm font-semibold text-white"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

