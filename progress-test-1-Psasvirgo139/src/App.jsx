import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UserListPage from './pages/UserListPage'
import AppNavbar from './components/AppNavbar'

function PrivateRoute({ children }) {
  const { state } = useAuth()
  return state.isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const { state } = useAuth()

  return (
    <BrowserRouter>
      {state.isAuthenticated && <AppNavbar />}
      <Routes>
        <Route
          path="/login"
          element={
            state.isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserListPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

