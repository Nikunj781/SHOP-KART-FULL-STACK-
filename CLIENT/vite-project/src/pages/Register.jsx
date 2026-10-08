import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../services/api.js'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check terms
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service')
      return
    }

    setLoading(true)

    try {
      await axiosInstance.post('customers/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })

      navigate('/home')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center font-sans"
      style={{
        backgroundImage: `linear-gradient(rgba(102, 187, 182, 0.8), rgba(70, 160, 155, 0.8)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="w-full max-w-[460px] bg-white rounded-md shadow-2xl px-12 py-10 text-center z-10">

        <h2 className="text-[20px] font-bold tracking-wider text-slate-800 mb-7 uppercase">
          CREATE ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-teal-400 placeholder:text-gray-400 text-gray-700"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-teal-400 placeholder:text-gray-400 text-gray-700"
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-teal-400 placeholder:text-gray-400 text-gray-700"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-teal-400 placeholder:text-gray-400 text-gray-700"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-teal-400 placeholder:text-gray-400 text-gray-700"
            required
          />

          {/* Terms */}
          <div className="flex items-center gap-2 text-left mt-0.5">

            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-3.5 h-3.5 accent-teal-500 rounded border-gray-300 cursor-pointer"
            />

            <label
              htmlFor="agreeTerms"
              className="text-[12px] text-gray-500 select-none"
            >
              I agree all statements in{' '}
              <a
                href="#terms"
                className="text-gray-700 underline font-medium hover:text-gray-900"
              >
                Terms of service
              </a>
            </label>

          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 text-[12px] font-bold tracking-wider text-white bg-gradient-to-r from-[#9bb0f7] to-[#42d3c7] rounded shadow-sm hover:opacity-95 transition-opacity uppercase disabled:opacity-50"
          >
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>

        </form>

        <p className="mt-12 text-[12px] text-gray-500">
          Have already an account?{' '}
          <Link
            to="/login"
            className="font-bold text-gray-900 underline hover:text-black"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register