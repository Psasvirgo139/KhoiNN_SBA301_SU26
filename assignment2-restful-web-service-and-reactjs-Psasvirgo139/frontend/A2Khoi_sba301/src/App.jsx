// TODO-09: Router + role-based routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AccountManagementPage from './pages/AccountManagementPage'
import CategoryManagementPage from './pages/CategoryManagementPage'
import NewsManagementPage from './pages/NewsManagementPage'
import NewsHistoryPage from './pages/NewsHistoryPage'
import ProfilePage from './pages/ProfilePage'

const ADMIN = 1
const STAFF = 2

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/accounts" element={
            <ProtectedRoute roles={[ADMIN]}><AccountManagementPage /></ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute roles={[STAFF]}><CategoryManagementPage /></ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute roles={[STAFF]}><NewsManagementPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={[STAFF]}><NewsHistoryPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={[STAFF]}><ProfilePage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
