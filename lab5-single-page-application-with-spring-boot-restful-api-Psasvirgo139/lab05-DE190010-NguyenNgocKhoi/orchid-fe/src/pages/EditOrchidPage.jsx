import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrchid } from '../context/OrchidContext';
import { getOrchidById } from '../utils/orchidApi';
import { Container, Breadcrumb, Alert, Spinner } from 'react-bootstrap';
import OrchidForm from '../components/OrchidForm';

export default function EditOrchidPage() {
  const { id } = useParams();
  const { editOrchid } = useOrchid();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchOrchid = async () => {
      setFetching(true);
      setError('');
      try {
        const res = await getOrchidById(id);
        if (isMounted) {
          setOrchid(res.data);
        }
      } catch (err) {
        if (isMounted) {
          const errMsg = err.response?.data?.message || err.message || 'Không tìm thấy hoa lan hoặc lỗi tải dữ liệu';
          setError(errMsg);
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    if (id) {
      fetchOrchid();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await editOrchid(id, data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi cập nhật thông tin hoa lan';
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
        <Breadcrumb.Item active>Edit Orchid #[{id}]</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Chỉnh sửa thông tin hoa lan</h2>
        <p className="text-muted">Cập nhật thông tin chi tiết của hoa lan #{id}</p>
      </div>

      {success && (
        <Alert variant="success" className="shadow-sm">
          Cập nhật thông tin hoa lan thành công! Đang chuyển hướng về trang chủ...
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">
          <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {fetching ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" className="mb-2">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="text-muted">Đang tải dữ liệu hoa lan...</div>
        </div>
      ) : (
        orchid && (
          <OrchidForm
            initialData={orchid}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            loading={saving}
          />
        )
      )}
    </Container>
  );
}
