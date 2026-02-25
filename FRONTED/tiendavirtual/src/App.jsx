

import { Routes, Route } from 'react-router-dom'
import Home from './components/Pages/Home.jsx'
import Register from './components/Auth/Register.jsx'
import Login from './components/Auth/Login.jsx'
import Perfil from './components/Pages/Perfil.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/perfil' element={<Perfil />} />
    </Routes>
  )
}

export default App;