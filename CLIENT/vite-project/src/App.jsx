import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

import { AuthProvider } from './context/authContext'

import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<PublicRoute> <Landing /> </PublicRoute>} />
          <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup /> </PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App