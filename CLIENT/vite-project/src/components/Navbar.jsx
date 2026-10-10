import { useNavigate, Link } from 'react-router-dom'
import { axiosInstance } from '../services/api.js'
import { useAuth } from '../context/authContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { setCustomer } = useAuth()
  const { cartCount, clearCart } = useCart()

  const handleLogout = async () => {
    try {
      await axiosInstance.post('customers/logout')
    } catch (err) {
      console.log(err)
    }
    clearCart()
    setCustomer(null)
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between bg-black px-6 py-3 text-white">
      <Link to="/home" className="text-lg font-bold">ShopKart</Link>
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-sm">Products</Link>
        <Link to="/wishlist" className="text-sm">Wishlist</Link>
        <Link to="/cart" className="text-sm">
          Cart{' '}
          {cartCount > 0 && (
            <span className="ml-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/orders" className="text-sm">Orders</Link>
        <button
          onClick={handleLogout}
          className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar