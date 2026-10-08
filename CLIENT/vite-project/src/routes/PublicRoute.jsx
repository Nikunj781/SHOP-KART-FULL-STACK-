import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const PublicRoute = ({ children }) => {
  const { customer, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (customer) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default PublicRoute