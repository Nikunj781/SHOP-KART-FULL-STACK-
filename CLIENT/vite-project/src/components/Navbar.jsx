import { useNavigate, Link } from 'react-router-dom'
import { axiosInstance } from '../services/api.js'
import { useAuth } from '../context/authContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { setCustomer } = useAuth()

  const handleLogout = async () => {
    try {
      await axiosInstance.post('customers/logout')
    } catch (err) {
      console.log(err)
    }
    setCustomer(null)
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between bg-black px-6 py-3 text-white">
      <Link to="/home" className="text-lg font-bold">ShopKart</Link>
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-sm">Products</Link>
        <button onClick={handleLogout} className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar