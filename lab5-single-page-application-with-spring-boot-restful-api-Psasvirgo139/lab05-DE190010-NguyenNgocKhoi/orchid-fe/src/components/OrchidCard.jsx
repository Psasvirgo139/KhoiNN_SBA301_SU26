import { Card, Button, Badge, Col } from 'react-bootstrap';

export default function OrchidCard({ orchid, onEdit, onDelete }) {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 shadow-sm border-0 hover-card">
        {orchid.orchidURL && (
          <Card.Img
            variant="top"
            src={orchid.orchidURL}
            alt={orchid.orchidName}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={handleImageError}
          />
        )}
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold text-primary mb-1">{orchid.orchidName}</Card.Title>
          <Card.Subtitle className="text-muted small mb-2">{orchid.orchidCategory || 'N/A'}</Card.Subtitle>
          
          <div className="mb-2 d-flex gap-1 flex-wrap">
            {orchid.isNatural ? (
              <Badge bg="success">Natural</Badge>
            ) : (
              <Badge bg="secondary">Hybrid</Badge>
            )}
            {orchid.isAttractive ? (
              <Badge bg="warning" text="dark">Attractive</Badge>
            ) : (
              <Badge bg="light" text="dark">Normal</Badge>
            )}
          </div>

          <Card.Text className="text-muted small flex-grow-1 text-truncate-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {orchid.orchidDescription || 'Không có mô tả.'}
          </Card.Text>

          <div className="d-flex gap-2 mt-3">
            <Button
              variant="outline-primary"
              size="sm"
              className="w-50"
              onClick={() => onEdit(orchid.orchidId)}
            >
              Sửa
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="w-50"
              onClick={() => onDelete(orchid.orchidId)}
            >
              Xóa
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
