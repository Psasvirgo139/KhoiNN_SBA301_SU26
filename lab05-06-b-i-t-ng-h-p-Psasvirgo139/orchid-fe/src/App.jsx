import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { OrchidProvider } from './context/OrchidContext'
import AppNavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AddOrchidPage from './pages/AddOrchidPage'
import EditOrchidPage from './pages/EditOrchidPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider PHẢI nằm bên trong BrowserRouter vì có sử dụng useNavigate() */}
      <AuthProvider>
        <OrchidProvider>
          <AppNavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/add" element={<ProtectedRoute><AddOrchidPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditOrchidPage /></ProtectedRoute>} />
          </Routes>
        </OrchidProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
