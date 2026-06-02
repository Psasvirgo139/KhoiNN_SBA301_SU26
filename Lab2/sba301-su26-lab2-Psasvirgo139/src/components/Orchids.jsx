import React, { useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { OrchidsData } from '../shared/ListOfOrchids'
import OrchidCard from './OrchidCard'
import OrchidDetailModal from './OrchidDetailModal'

export default function Orchids() {
  const [show, setShow] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);

  const handleShow = (orchid) => {
    setSelectedOrchid(orchid);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Container className="my-4">
      <Row className="g-4">
        {OrchidsData.map((orchid) => (
          <Col md={3} key={orchid.id}>
            <OrchidCard orchid={orchid} onShowDetail={handleShow} />
          </Col>
        ))}
      </Row>
      <OrchidDetailModal 
        show={show} 
        orchid={selectedOrchid} 
        onClose={handleClose} 
      />
    </Container>
  );
}
