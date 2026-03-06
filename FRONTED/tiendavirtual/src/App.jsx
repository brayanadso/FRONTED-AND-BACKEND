import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Home from './components/Pages/Home.jsx'
import Register from './components/Auth/Register.jsx'
import Login from './components/Auth/Login.jsx'
import Perfil from './components/Pages/Perfil.jsx'
import ForgotPassword from './components/Pages/ForgotPassword.jsx'
import VerifyCode from './components/Pages/VerifyCode.jsx'
import Admin from './components/Pages/Admin.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/'                element={<Home />} />
        <Route path='/register'        element={<Register />} />
        <Route path='/login'           element={<Login />} />
        <Route path='/perfil'          element={<Perfil />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-code'     element={<VerifyCode />} />
        <Route path='/admin' element={
          <PrivateRoute rolRequerido="admin">
            <Admin />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App