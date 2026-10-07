import { useNavigate } from 'react-router-dom'
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
      <h1 className="text-lg font-bold">ShopKart</h1>
      <button onClick={handleLogout} className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black">
        Logout
      </button>
    </nav>
  )
}

export default Navbar