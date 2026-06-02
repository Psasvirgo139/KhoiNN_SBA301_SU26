import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage            from '../pages/HomePage'
import Ex01CounterPage     from '../pages/Ex01CounterPage'
import Ex02LoginPage       from '../pages/Ex02LoginPage'
import Ex03ValidationPage  from '../pages/Ex03ValidationPage'
import Ex04ThemePage       from '../pages/Ex04ThemePage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"     element={<HomePage />} />
        <Route path="/ex01" element={<Ex01CounterPage />} />
        <Route path="/ex02" element={<Ex02LoginPage />} />
        <Route path="/ex03" element={<Ex03ValidationPage />} />
        <Route path="/ex04" element={<Ex04ThemePage />} />
      </Routes>
    </BrowserRouter>
  )
}
