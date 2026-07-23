import { useState, useEffect } from 'react'
import { Form, Row, Col, Button, Image } from 'react-bootstrap'

const EMPTY = {
  orchidName: '',
  orchidCategory: '',
  orchidDescription: '',
  orchidURL: '',
  isNatural: false,
  isAttractive: false,
}

export default function OrchidForm({ initialData, onSubmit, submitLabel = 'Lưu', loading }) {
  const [form, setForm] = useState(initialData ?? EMPTY)
  
  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
      <Row className="mb-3">
        <Form.Group as={Col} md={6}>
          <Form.Label>Tên hoa lan *</Form.Label>
          <Form.Control
            name="orchidName"
            value={form.orchidName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Label>Danh mục</Form.Label>
          <Form.Control
            name="orchidCategory"
            value={form.orchidCategory}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="orchidDescription"
          value={form.orchidDescription}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL hình ảnh</Form.Label>
        <Form.Control
          type="url"
          name="orchidURL"
          value={form.orchidURL}
          onChange={handleChange}
        />
        {form.orchidURL && (
          <Image
            src={form.orchidURL}
            className="mt-2"
            style={{ maxHeight: 120 }}
            rounded
          />
        )}
      </Form.Group>
      <Row className="mb-3">
        <Col>
          <Form.Check
            type="switch"
            id="isNatural"
            name="isNatural"
            label="Hoa tự nhiên"
            checked={form.isNatural}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Form.Check
            type="switch"
            id="isAttractive"
            name="isAttractive"
            label="Hoa hấp dẫn"
            checked={form.isAttractive}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Đang lưu...' : submitLabel}
      </Button>
    </Form>
  )
}
