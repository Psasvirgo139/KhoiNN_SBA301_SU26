import { MemoryRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';

export default function AppRouter() {
  return (
    // TODO 1: Bọc toàn bộ trong <MemoryRouter>

    // TODO 2: Thêm Navbar đơn giản với NavLink đến '/'
    //         Navbar.Brand: "🛍️ Cửa Hàng"
    //         Nav.Link đến "/" label "Sản Phẩm" (dùng NavLink from react-router-dom)

    // TODO 3: Thêm <Routes> với các <Route>:
    //         - path="/"               → element={<ProductList />}
    //         - path="/products/:id"   → element={<ProductDetail />}
    //         - path="/404"            → element={<NotFound />}
    //         - path="*"               → element={<NotFound />}  (wildcard cho mọi route không khớp)

    <div>Chưa cài đặt Routing — hãy hoàn thành các TODO</div>
  );
}
