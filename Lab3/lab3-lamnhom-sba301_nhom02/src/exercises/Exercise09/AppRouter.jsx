import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';

export default function AppRouter() {
  return (
    // TODO 1: Bọc toàn bộ trong <MemoryRouter>

    // TODO 2: Thêm Navbar với Navbar.Brand "📰 Blog Lập Trình"

    // TODO 3: Thêm <Routes> với các <Route>:
    //         - path="/"          → element={<BlogList />}
    //         - path="/blog/:id"  → element={<BlogDetail />}

    <div>Chưa cài đặt Routing — hãy hoàn thành các TODO</div>
  );
}
