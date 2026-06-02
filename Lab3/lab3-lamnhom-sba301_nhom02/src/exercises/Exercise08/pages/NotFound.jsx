import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  // TODO 1: Khai báo biến `navigate` bằng hook useNavigate()

  return (
    <Container className="text-center mt-5" data-testid="not-found-page">
      <div style={{ fontSize: '6rem' }}>🔍</div>
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h3 className="text-secondary mb-4">Trang Không Tồn Tại</h3>
      <p className="text-muted mb-5">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.
      </p>

      {/* TODO 2: Button variant="primary", data-testid="go-home-btn"
                  onClick: navigate('/') để quay về trang chủ
                  label "Về Trang Chủ" */}
    </Container>
  );
}
