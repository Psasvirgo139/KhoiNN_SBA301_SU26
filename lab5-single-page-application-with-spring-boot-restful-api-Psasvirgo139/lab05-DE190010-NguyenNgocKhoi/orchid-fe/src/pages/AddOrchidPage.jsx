import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrchid } from '../context/OrchidContext';
import { Container, Breadcrumb, Alert } from 'react-bootstrap';
import OrchidForm from '../components/OrchidForm';

export default function AddOrchidPage() {
  const { addOrchid } = useOrchid();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await addOrchid(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi thêm hoa lan mới';
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '720px' }}>
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Trang chủ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Thêm hoa lan mới</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Thêm hoa lan mới</h2>
        <p className="text-muted">Nhập thông tin hoa lan và lưu trữ vào cơ sở dữ liệu</p>
      </div>

      {success && (
        <Alert variant="success" className="shadow-sm">
          Thêm hoa lan mới thành công! Đang chuyển hướng về trang chủ...
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">
          <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      <OrchidForm
        onSubmit={handleSubmit}
        submitLabel="Add Orchid"
        loading={saving}
      />
    </Container>
  );
}
