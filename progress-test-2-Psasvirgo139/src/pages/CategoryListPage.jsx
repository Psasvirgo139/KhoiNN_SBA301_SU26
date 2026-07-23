import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button, Alert, Table, Form, Row, Col, Modal } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Pagination from '../components/restaurant/Pagination'
import { getCategories, deleteCategory } from '../services/categoryService'
import { MESSAGES } from '../constants/messages'

const PAGE_SIZE = 5

/**
 * CategoryListPage — Trang danh sách danh mục.
 * Giao diện và các hành vi tương tự RestaurantListPage.
 */
function CategoryListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // --- States ---
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || '')
  const [errorMsg, setErrorMsg] = useState('')

  // Filter state
  const [searchName, setSearchName] = useState('')

  // DeleteModal state
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  // --- Load Data ---
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getCategories()
      // Sắp xếp danh mục theo tên alphabetically (A-Z) để giao diện nhất quán
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name))
      setCategories(sorted)
      setFiltered(sorted)
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  // --- Filter Handle ---
  function handleFilterSubmit(e) {
    e.preventDefault()
    let result = [...categories]
    if (searchName) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    setFiltered(result)
    setCurrentPage(1)
  }

  // --- Delete Handle ---
  function handleDeleteClick(category) {
    setSelectedCategory(category)
    setShowModal(true)
  }

  async function handleDeleteConfirm() {
    setShowModal(false)
    try {
      await deleteCategory(selectedCategory.id)
      setSuccessMsg(MESSAGES.MS08) // "Deleted successfully"
      await loadData()
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  // --- Pagination ---
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginatedCategories = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <>
      <Header />
      <Container className="my-4">
        <h4 className="fw-bold text-dark mb-3">Category List</h4>

        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* Nút Add New */}
        <div className="d-flex justify-content-end mb-3">
          <Button variant="success" onClick={() => navigate('/categories/add')} className="fw-semibold px-4">
            Add New
          </Button>
        </div>

        {/* Form lọc danh mục */}
        <Form onSubmit={handleFilterSubmit} className="mb-4 p-3 bg-light rounded border">
          <Row className="g-2 align-items-end">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name to filter"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button type="submit" variant="primary" className="w-100 fw-semibold">
                Filter
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Bảng hiển thị danh mục */}
        {paginatedCategories.length === 0 ? (
          <p className="text-center text-muted my-5">No records found</p>
        ) : (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '10%' }}>#</th>
                <th style={{ width: '25%' }}>Category ID</th>
                <th style={{ width: '45%' }}>Category Name</th>
                <th style={{ width: '20%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((c, index) => (
                <tr key={c.id}>
                  <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <Button
                      variant="link"
                      className="text-danger p-0 fw-semibold"
                      onClick={() => handleDeleteClick(c)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filtered.length}
          pageSize={PAGE_SIZE}
        />

        {/* Xác nhận xóa Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCategory && (
              <p>
                Are you sure you want to delete the category &quot;
                <strong>{selectedCategory.name}</strong>&quot;?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleDeleteConfirm}>
              Yes
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Footer />
    </>
  )
}

export default CategoryListPage
