import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppNavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import BookDetail from './pages/BookDetail';

export default function AppRouter() {
  return (
    <MemoryRouter>
      <AppNavBar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/edit/:id" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
