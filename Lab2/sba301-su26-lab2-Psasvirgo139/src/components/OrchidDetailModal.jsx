import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function OrchidDetailModal({ show, orchid, onClose }) {
  if (!show || !orchid) return null
  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>{orchid.orchidName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <img src={orchid.image} alt={orchid.orchidName} />
        <p>{orchid.description}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
}
