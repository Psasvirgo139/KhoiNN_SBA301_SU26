// TODO-11: Modal xac nhan truoc khi xoa (Delete always combines with confirmation)
import { Button, Modal } from 'react-bootstrap'

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Confirm Delete'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Are you sure you want to delete this item?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
