import { Modal, Button } from 'react-bootstrap'

/**
 * DeleteModal — hộp thoại xác nhận xóa restaurant.
 *
 * Props:
 *   show        {boolean}   hiển thị / ẩn modal
 *   restaurant  {object}    restaurant cần xóa { id, name }
 *   onConfirm   {Function}  callback khi user chọn "Yes"
 *   onClose     {Function}  callback khi user chọn "Close"
 */
function DeleteModal({ show, restaurant, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {restaurant && (
          <p>
            Are you sure you want to delete the restaurant &quot;
            <strong>{restaurant.name}</strong>&quot;?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>Yes</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal
