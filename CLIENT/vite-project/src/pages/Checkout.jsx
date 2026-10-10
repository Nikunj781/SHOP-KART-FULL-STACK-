import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'
import { createPaymentOrder, verifyPayment } from '../services/api.js'

// Dynamically loads the Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: ''
}

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartSubtotal, clearCart } = useCart()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [serverError, setServerError] = useState('')

  // Guard: redirect to cart if nothing to checkout
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  // --- Client-side validation ---
  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone.trim())) newErrors.phone = 'Phone must be a 10-digit number'
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!/^\d{6}$/.test(form.pincode.trim())) newErrors.pincode = 'Pincode must be 6 digits'
    return newErrors
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  // --- Place Order handler ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setServerError('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setPlacing(true)
    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setServerError('Failed to load payment gateway. Please try again.')
        setPlacing(false)
        return
      }

      // 2. Create payment order on backend
      const res = await createPaymentOrder(form)
      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = res.data

      // 3. Open Razorpay Checkout
      const options = {
        key,
        amount,
        currency,
        name: 'ShopKart',
        description: 'ShopKart Order',
        order_id: razorpayOrderId,

        handler: async function (response) {
          // 4. Verify payment signature on backend
          try {
            const verifyRes = await verifyPayment({
              shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verifyRes.data.success) {
              // 5. Clear frontend cart state → Navbar shows Cart (0)
              clearCart()
              navigate(`/order-success/${shopKartOrderId}`)
            }
          } catch (err) {
            setServerError(
              err?.response?.data?.message || 'Payment verification failed. Please contact support.'
            )
          }
        },

        prefill: {
          name: form.fullName,
          contact: form.phone
        },

        theme: { color: '#000000' }
      }

      const paymentObject = new window.Razorpay(options)

      paymentObject.on('payment.failed', function (response) {
        setServerError(`Payment failed: ${response.error.description}. Your cart is intact — please try again.`)
      })

      paymentObject.open()
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'addressLine1', label: 'Address Line', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-2xl font-bold">Checkout</h2>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Shipping Form */}
          <div className="flex-1">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Shipping Details</h3>
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                {fields.map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={label}
                      className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[name] && (
                      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
                    )}
                  </div>
                ))}

                {serverError && (
                  <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={placing}
                  className="mt-2 w-full rounded bg-black py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {placing ? 'Processing...' : 'Pay with Razorpay'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
              <div className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t pt-3 font-bold">
                <span>Total</span>
                <span>₹{cartSubtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout
