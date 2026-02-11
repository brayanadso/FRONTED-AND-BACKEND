import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Pages/Home.jsx'
import Register from './components/Auth/Register.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;