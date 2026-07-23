import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrchid } from '../context/OrchidContext';
import { Spinner, Alert, Button, ButtonGroup, Row, Container } from 'react-bootstrap';
import OrchidTable from '../components/OrchidTable';
import OrchidCard from '../components/OrchidCard';
import ConfirmModal from '../components/ConfirmModal';

export default function HomePage() {
  const { orchids, loading, error, fetchOrchids, removeOrchid } = useOrchid();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch orchids on component mount
  useEffect(() => {
    fetchOrchids();
  }, [fetchOrchids]);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    const target = orchids.find((o) => o.orchidId === id);
    if (target) {
      setDeleteTarget(target);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeOrchid(deleteTarget.orchidId);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Lỗi khi xóa orchid:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold text-dark mb-1">Quản lý Lan (Orchid Management)</h1>
          <p className="text-muted mb-0">Xem danh sách, thêm mới, cập nhật và xóa thông tin các loài hoa lan</p>
        </div>
        <Button variant="success" size="lg" className="shadow-sm" onClick={() => navigate('/add')}>
          ➕ Thêm hoa lan mới
        </Button>
      </div>

      {/* Control Panel (View Toggle) */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="text-muted">
          Tổng cộng: <strong>{orchids.length}</strong> loài lan
        </div>
        <ButtonGroup className="shadow-sm">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('table')}
          >
            📋 Dạng bảng (Table)
          </Button>
          <Button
            variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('card')}
          >
            🎴 Dạng thẻ (Grid)
          </Button>
        </ButtonGroup>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="danger" dismissible className="shadow-sm">
          <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {/* Loading State */}
      {loading && orchids.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" className="mb-2">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="text-muted">Đang tải danh sách hoa lan...</div>
        </div>
      ) : (
        /* Data Presentation */
        <>
          {viewMode === 'table' ? (
            <OrchidTable orchids={orchids} onEdit={handleEdit} onDelete={handleDeleteClick} />
          ) : (
            <Row>
              {orchids.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Danh sách lan trống.
                </div>
              ) : (
                orchids.map((o) => (
                  <OrchidCard key={o.orchidId} orchid={o} onEdit={handleEdit} onDelete={handleDeleteClick} />
                ))
              )}
            </Row>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteTarget !== null}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        orchidName={deleteTarget?.orchidName || ''}
        loading={deleting}
      />
    </Container>
  );
}
