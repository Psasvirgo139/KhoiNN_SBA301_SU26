import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const EMPTY_FORM = {
  orchidName: '',
  orchidCategory: '',
  orchidDescription: '',
  orchidURL: '',
  isNatural: false,
  isAttractive: false,
};

export default function OrchidForm({ initialData, onSubmit, submitLabel = 'Lưu', loading = false }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Sync state with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        orchidName: initialData.orchidName || '',
        orchidCategory: initialData.orchidCategory || '',
        orchidDescription: initialData.orchidDescription || '',
        orchidURL: initialData.orchidURL || '',
        isNatural: !!initialData.isNatural,
        isAttractive: !!initialData.isAttractive,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="orchidName">
            <Form.Label className="fw-semibold">Tên hoa lan <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="orchidName"
              value={formData.orchidName}
              onChange={handleChange}
              placeholder="Nhập tên hoa lan (Ví dụ: Mokara, Dendrobium...)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="orchidCategory">
            <Form.Label className="fw-semibold">Danh mục / Loài</Form.Label>
            <Form.Control
              type="text"
              name="orchidCategory"
              value={formData.orchidCategory}
              onChange={handleChange}
              placeholder="Nhập loài hoa lan"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="orchidDescription">
            <Form.Label className="fw-semibold">Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="orchidDescription"
              value={formData.orchidDescription}
              onChange={handleChange}
              placeholder="Nhập thông tin chi tiết về hoa lan này..."
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="orchidURL">
            <Form.Label className="fw-semibold">Đường dẫn ảnh (URL)</Form.Label>
            <Form.Control
              type="url"
              name="orchidURL"
              value={formData.orchidURL}
              onChange={handleChange}
              placeholder="https://example.com/orchid.jpg"
            />
            {formData.orchidURL && (
              <div className="mt-3 text-center border rounded p-2 bg-light">
                <div className="text-muted small mb-1">Xem trước hình ảnh:</div>
                <img
                  src={formData.orchidURL}
                  alt="Xem trước ảnh"
                  style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Row className="mb-4">
            <Col xs={6}>
              <Form.Group controlId="isNatural">
                <Form.Check
                  type="switch"
                  label="Loài tự nhiên (Natural)"
                  name="isNatural"
                  checked={formData.isNatural}
                  onChange={handleChange}
                  className="fw-semibold"
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="isAttractive">
                <Form.Check
                  type="switch"
                  label="Cuốn hút (Attractive)"
                  name="isAttractive"
                  checked={formData.isAttractive}
                  onChange={handleChange}
                  className="fw-semibold"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading} size="lg">
              {loading ? 'Đang lưu...' : submitLabel}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
