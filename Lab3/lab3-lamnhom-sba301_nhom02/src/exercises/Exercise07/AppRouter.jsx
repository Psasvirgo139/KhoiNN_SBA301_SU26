import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

export default function AppRouter() {
  return (
    // TODO 1: Bọc toàn bộ nội dung trong <MemoryRouter>

    // TODO 2: Render <NavBar /> ở trên cùng

    // TODO 3: Bên dưới NavBar, thêm <Routes> chứa các <Route>:
    //         - path="/"        → element={<Home />}
    //         - path="/about"   → element={<About />}
    //         - path="/contact" → element={<Contact />}

    <div>Chưa cài đặt Routing — hãy hoàn thành các TODO</div>
  );
}
