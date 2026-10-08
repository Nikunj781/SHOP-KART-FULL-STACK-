import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../services/api.js'
import { useAuth } from '../context/authContext.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { fetchCustomer } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await axiosInstance.post('customers/login', { email, password })
      await fetchCustomer()
      navigate('/home')
    } catch  {
      setError('Invalid Credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-8 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Welcome Back!</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" className="bg-black text-white rounded py-2 text-sm font-semibold">
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="underline font-semibold">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login