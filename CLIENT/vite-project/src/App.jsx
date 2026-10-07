import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'


function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path ="/register" element={<Register />} />
          <Route path ="/login" element={<Login />} />

          <Route path = "/home" element={<Home />} />

        </Routes> 
        

      </BrowserRouter>
    </>
  )
}

export default App
