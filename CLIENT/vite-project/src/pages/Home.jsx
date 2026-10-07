import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/authContext.jsx'

const Home = () => {
  const { customer } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 shadow">
        <h2 className="mb-4 text-xl font-bold">Welcome, {customer.name}!</h2>
        <p className="text-sm text-gray-600">Email: {customer.email}</p>
        <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
      </div>
    </div>
  )
}

export default Home