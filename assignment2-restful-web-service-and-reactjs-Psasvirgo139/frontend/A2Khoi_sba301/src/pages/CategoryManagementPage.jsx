// TODO-12: Category Management (Staff) - CRUD + Search, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import {
  getCategories, searchCategories, createCategory, updateCategory, deleteCategory
} from '../services/categoryService'
import CategoryModal from '../components/CategoryModal'
import ConfirmModal from '../components/ConfirmModal'

function CategoryManagementPage() {
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([]) // cho dropdown parent
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const loadCategories = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchCategories(keyword.trim()) : await getCategories()
      setCategories(data)
      if (!keyword.trim()) setAllCategories(data)
    } catch {
      setError('Cannot load categories')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadCategories()
  }

  const handleSave = async (form) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, form)
      } else {
        await createCategory(form)
      }
      setShowModal(false)
      setEditingCategory(null)
      loadCategories()
    } catch (err) {
      throw new Error(err.message || 'Save failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(deletingCategory.categoryId)
      setDeletingCategory(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingCategory(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">Category Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by category name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingCategory(null); setShowModal(true) }}>
          + Add Category
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Parent</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>{cat.categoryName}</td>
              <td>{cat.categoryDescription}</td>
              <td>{cat.parentCategoryName || '-'}</td>
              <td>
                <Badge bg={cat.isActive ? 'success' : 'secondary'}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingCategory(cat); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingCategory(cat)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CategoryModal
        show={showModal}
        category={editingCategory}
        categories={allCategories}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingCategory(null) }}
      />
      <ConfirmModal
        show={!!deletingCategory}
        message={`Delete category "${deletingCategory?.categoryName}"? A category used by news articles cannot be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </Container>
  )
}

export default CategoryManagementPage
