import React from 'react'
import { Card, Button } from 'react-bootstrap'

export default function OrchidCard({ orchid, onShowDetail }) {
  if (!orchid) return null;
  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Img 
        variant="top" 
        src={orchid.image} 
        style={{ height: '230px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title>{orchid.orchidName}</Card.Title>
        <Card.Text>
          {orchid.category}
        </Card.Text>
        <Button 
          variant="primary" 
          onClick={() => onShowDetail(orchid)}
          className="w-100 mt-auto"
        >
          Detail
        </Button>
      </Card.Body>
    </Card>
  )
}
