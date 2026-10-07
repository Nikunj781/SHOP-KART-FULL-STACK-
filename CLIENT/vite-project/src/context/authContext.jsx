import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../services/api.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance
      .get('users/me')
      .then((response) => {
        setCustomer(response.data.userData)
      })
      .catch(() => {
        setCustomer(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ customer, setCustomer, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)