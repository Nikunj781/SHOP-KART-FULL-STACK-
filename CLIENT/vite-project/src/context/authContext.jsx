import { useState, useEffect, useContext, createContext } from 'react'
import { axiosInstance } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCustomer = () => {
    return axiosInstance
      .get('customers/me')
      .then((response) => setCustomer(response.data.userData))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCustomer()
  }, [])

  return (
    <AuthContext.Provider
      value={{ customer, setCustomer, loading, fetchCustomer }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)