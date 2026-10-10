import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Orders from './pages/Orders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import { AuthProvider } from './context/authContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />

            <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App