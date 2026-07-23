import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrchidProvider } from './context/OrchidContext'
import AppNavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import AddOrchidPage from './pages/AddOrchidPage'
import EditOrchidPage from './pages/EditOrchidPage'

function App() {
  return (
    <OrchidProvider>
      <BrowserRouter>
        <AppNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddOrchidPage />} />
          <Route path="/edit/:id" element={<EditOrchidPage />} />
        </Routes>
      </BrowserRouter>
    </OrchidProvider>
  )
}

export default App
