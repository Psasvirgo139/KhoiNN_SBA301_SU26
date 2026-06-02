import { useState } from 'react';
import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import Counter from './exercises/Exercise01/Counter';
import TodoList from './exercises/Exercise02/TodoList';
import ProductFilter from './exercises/Exercise03/ProductFilter';
import RegistrationForm from './exercises/Exercise04/RegistrationForm';
import ShoppingCart from './exercises/Exercise05/ShoppingCart';
import StudentManagement from './exercises/Exercise06/StudentManagement';
import AppRouter07 from './exercises/Exercise07/AppRouter';
import AppRouter08 from './exercises/Exercise08/AppRouter';
import AppRouter09 from './exercises/Exercise09/AppRouter';
import AppRouter10 from './exercises/Exercise10/AppRouter';

const exercises = [
  { id: 1, label: 'Bài 01', title: 'Counter', topic: 'useState', difficulty: 1, points: 5, component: Counter },
  { id: 2, label: 'Bài 02', title: 'Todo List', topic: 'useState + CRUD', difficulty: 2, points: 8, component: TodoList },
  { id: 3, label: 'Bài 03', title: 'Product Filter', topic: 'useState + Filter', difficulty: 2, points: 8, component: ProductFilter },
  { id: 4, label: 'Bài 04', title: 'Registration Form', topic: 'useState + Validation', difficulty: 3, points: 10, component: RegistrationForm },
  { id: 5, label: 'Bài 05', title: 'Shopping Cart', topic: 'useState + CRUD', difficulty: 3, points: 12, component: ShoppingCart },
  { id: 6, label: 'Bài 06', title: 'Student Management', topic: 'useState + Modal + Filter', difficulty: 4, points: 15, component: StudentManagement },
  { id: 7, label: 'Bài 07', title: 'Basic Routing', topic: 'React Router', difficulty: 3, points: 12, component: AppRouter07 },
  { id: 8, label: 'Bài 08', title: 'Dynamic Routes', topic: 'useParams + 404', difficulty: 4, points: 10, component: AppRouter08 },
  { id: 9, label: 'Bài 09', title: 'Blog & Search Params', topic: 'useSearchParams', difficulty: 4, points: 10, component: AppRouter09 },
  { id: 10, label: 'Bài 10', title: 'Book Management', topic: 'Full App', difficulty: 5, points: 10, component: AppRouter10 },
];

const difficultyStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const active = exercises.find((e) => e.id === activeId);
  const ActiveComponent = active?.component;

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" className="px-3 py-2">
        <Navbar.Brand className="fw-bold">⚛️ SBA301 — React Exercises</Navbar.Brand>
        {active && (
          <Badge bg="info" className="ms-auto fs-6">
            {active.label}: {active.title} · {active.points}đ
          </Badge>
        )}
      </Navbar>

      <div className="d-flex flex-grow-1">
        <Nav
          className="flex-column bg-light border-end py-2"
          style={{ width: 230, minHeight: '100%', flexShrink: 0 }}
          activeKey={activeId}
          onSelect={(k) => setActiveId(Number(k))}
        >
          {exercises.map((ex) => (
            <Nav.Link
              key={ex.id}
              eventKey={ex.id}
              className={`px-3 py-2 mb-1 mx-2 rounded ${activeId === ex.id ? 'bg-primary text-white' : 'text-dark'}`}
            >
              <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{ex.label} — {ex.title}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                {difficultyStars(ex.difficulty)} · {ex.points}đ
              </div>
            </Nav.Link>
          ))}
        </Nav>

        <div className="flex-grow-1 overflow-auto" style={{ background: '#f8f9fa' }}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
