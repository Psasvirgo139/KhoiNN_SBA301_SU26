// src/pages/NotFound.jsx
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <h1 style={{ fontSize: 96, color: '#dee2e6' }}>404</h1>
      <h4>Trang không tồn tại</h4>
      <p className='text-muted'>URL bạn đâu đó sai rồi!</p>
      <Button as={Link} to='/' variant='primary'>Về trang chủ</Button>
    </Container>
  );
}
export default NotFound;
