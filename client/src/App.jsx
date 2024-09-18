import './App.css'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SigninPage'
import SignUpPage from './pages/SignUpPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </Router>
  )
}

export default App
