// TODO-12: Popup dialog Create/Update category + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const emptyForm = { categoryName: '', categoryDescription: '', parentCategoryId: '', isActive: true }

function CategoryModal({ show, category, categories, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(category
        ? {
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            parentCategoryId: category.parentCategoryId ?? '',
            isActive: category.isActive
          }
        : emptyForm)
    }
  }, [show, category])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        categoryName: form.categoryName,
        categoryDescription: form.categoryDescription,
        parentCategoryId: form.parentCategoryId === '' ? null : Number(form.parentCategoryId),
        isActive: form.isActive
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{category ? 'Update Category' : 'Create Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control value={form.categoryName} required maxLength={100}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.categoryDescription} required maxLength={250}
              onChange={(e) => setForm({ ...form, categoryDescription: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Parent Category</Form.Label>
            <Form.Select value={form.parentCategoryId}
              onChange={(e) => setForm({ ...form, parentCategoryId: e.target.value })}>
              <option value="">-- None --</option>
              {categories && categories
                .filter((c) => c.categoryId !== category?.categoryId)
                .map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Active"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CategoryModal
