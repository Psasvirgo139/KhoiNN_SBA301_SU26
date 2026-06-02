import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function OrchidModal({ show, handleClose, selectedOrchid }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedOrchid ? selectedOrchid.orchidName : 'Orchid Detail'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedOrchid ? (
                    <div>
                        <img 
                            src={selectedOrchid.image} 
                            alt={selectedOrchid.orchidName} 
                            style={{ width: '100%', borderRadius: '5px', marginBottom: '15px' }} 
                        />
                        <p>{selectedOrchid.description}</p>
                    </div>
                ) : (
                    <p>Loading details...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}