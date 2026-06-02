import React, { useState } from 'react'
import { Row, Col, Container, Card, Button } from 'react-bootstrap'
import OrchidModal from './OrchidModal.jsx';
import { OrchidsData } from '../data/ListOfOrchidss'

export default function Orchids() {
    const [show, setShow] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState(null); 
    const handleClose = () => setShow(false);
    const handleShow = (orchid) => {
        setSelectedOrchid(orchid); 
        setShow(true); 
    }
    return (
        <Container className="my-4">
            <Row className="g-4">
                {OrchidsData.map((orchid) => (
                    <Col md={3} key={orchid.id}>
                        <Card className="h-100 d-flex flex-column">
                            <Card.Img variant="top" src={orchid.image} style={{ height: '230px', objectFit: 'cover' }}/>
                            <Card.Body className="d-flex flex-column flex-grow-1">
                                <Card.Title>{orchid.orchidName}</Card.Title>
                                <Card.Text>
                                    {orchid.category}
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleShow(orchid)} className="w-100 mt-auto">
                                    Detail
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <OrchidModal 
                show={show} 
                handleClose={handleClose} 
                selectedOrchid={selectedOrchid} 
            />
        </Container>
    )
}