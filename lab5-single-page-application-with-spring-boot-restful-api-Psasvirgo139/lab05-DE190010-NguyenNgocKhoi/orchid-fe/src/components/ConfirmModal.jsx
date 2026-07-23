import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal({ show, onHide, onConfirm, orchidName, loading = false }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton disabled={loading}>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa hoa lan{' '}
        <strong className="text-danger">{orchidName}</strong> không? Hành động này không thể hoàn tác.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
