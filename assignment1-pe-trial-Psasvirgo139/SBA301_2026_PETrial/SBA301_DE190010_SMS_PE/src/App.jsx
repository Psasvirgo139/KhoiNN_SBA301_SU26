import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ShoesList from './pages/ShoesList'
import AddShoes from './pages/AddShoes'
import ShoesDetail from './pages/ShoesDetail'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<ShoesList />} />
          <Route path="/shoes/add" element={<AddShoes />} />
          <Route path="/shoes/:id" element={<ShoesDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
