import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import { AuthProvider } from './context/authContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App