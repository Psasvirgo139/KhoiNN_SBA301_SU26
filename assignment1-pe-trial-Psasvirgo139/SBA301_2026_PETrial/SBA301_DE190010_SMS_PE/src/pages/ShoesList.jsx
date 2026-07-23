import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Table, Pagination, Modal, Alert, Card } from 'react-bootstrap'
import { searchShoes, deleteShoes, getCategories } from '../services/shoesService'

export const ShoesList = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // State
  const [shoesPage, setShoesPage] = useState({
    content: [],
    currentPage: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  })
  const [categories, setCategories] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [page, setPage] = useState(0)
  
  // Modal & Alerts
  const [showModal, setShowModal] = useState(false)
  const [selectedShoes, setSelectedShoes] = useState(null)
  const [message, setMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState('success')

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Load message from navigation state if present
  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message)
      setAlertVariant('success')
      // Clear state so message doesn't persist on page reload
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  // Fetch shoes whenever search query or page changes
  const fetchShoesData = async (pageIndex) => {
    try {
      const data = await searchShoes(searchName, searchCategory, pageIndex, 5)
      setShoesPage(data)
    } catch (err) {
      console.error('Error searching shoes:', err)
    }
  }

  useEffect(() => {
    fetchShoesData(page)
  }, [page, searchName, searchCategory])

  const handleFilter = (e) => {
    e.preventDefault()
    setSearchName(nameInput)
    setSearchCategory(categoryInput)
    setPage(0)
  }

  const handleDeleteClick = (shoes) => {
    setSelectedShoes(shoes)
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedShoes) return
    try {
      await deleteShoes(selectedShoes.shoesId)
      setMessage('Deleted successfully')
      setAlertVariant('success')
      setShowModal(false)
      setSelectedShoes(null)
      
      // Calculate appropriate next page
      const isLastItemOnPage = shoesPage.content.length === 1
      const nextPage = (isLastItemOnPage && page > 0) ? page - 1 : page
      if (nextPage !== page) {
        setPage(nextPage)
      } else {
        fetchShoesData(page)
      }
    } catch (err) {
      console.error('Error deleting shoes:', err)
      setMessage('Failed to delete shoes')
      setAlertVariant('danger')
      setShowModal(false)
    }
  }

  return (
    <Container className="py-4">
      {/* Messages */}
      {message && (
        <Alert variant={alertVariant} dismissible onClose={() => setMessage('')} className="shadow-sm">
          {message}
        </Alert>
      )}

      {/* Filter and Action Header */}
      <Card className="shadow-sm border-0 mb-4 bg-white rounded-3">
        <Card.Body className="p-4">
          <Row className="align-items-center g-3">
            <Col lg={8} md={12}>
              <Form onSubmit={handleFilter} className="d-flex flex-wrap gap-3">
                <Form.Group className="flex-grow-1 min-w-200">
                  <Form.Control
                    type="text"
                    placeholder="Search by Shoes Name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="min-w-200">
                  <Form.Select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="py-2"
                  >
                    <option value="">-- All Categories --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary" className="px-4 py-2 fw-semibold">
                  Filter
                </Button>
              </Form>
            </Col>
            <Col lg={4} md={12} className="text-lg-end text-start">
              <Button
                variant="success"
                onClick={() => navigate('/shoes/add')}
                className="px-4 py-2 fw-semibold shadow-sm"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', border: 'none' }}
              >
                Add New Shoes
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table Data */}
      <Card className="shadow-sm border-0 bg-white rounded-3 overflow-hidden">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0 table-borderless">
            <thead className="table-light text-secondary uppercase fs-7">
              <tr className="border-bottom border-light">
                <th className="py-3 px-4">#</th>
                <th className="py-3">Shoes Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Manufacturer</th>
                <th className="py-3 text-end">Price (đ)</th>
                <th className="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {shoesPage.content.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5 fs-5">
                    No records found
                  </td>
                </tr>
              ) : (
                shoesPage.content.map((item, index) => {
                  const sequenceNumber = shoesPage.currentPage * shoesPage.pageSize + index + 1
                  return (
                    <tr key={item.shoesId} className="border-bottom border-light">
                      <td className="py-3 px-4 fw-bold text-muted">{sequenceNumber}</td>
                      <td className="py-3 fw-semibold text-dark">{item.shoesName}</td>
                      <td className="py-3">
                        <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-1.5 fs-7">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="py-3 text-secondary">{item.manufacturer}</td>
                      <td className="py-3 text-end fw-semibold text-primary">
                        {item.price?.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <a
                          href="#"
                          className="text-danger fw-semibold me-3 text-decoration-none hover-underline"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteClick(item)
                          }}
                        >
                          Delete
                        </a>
                        <span className="text-muted">|</span>
                        <a
                          href="#"
                          className="text-primary fw-semibold ms-3 text-decoration-none hover-underline"
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(`/shoes/${item.shoesId}`)
                          }}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </Card.Body>

        {/* Footer info & Pagination */}
        {shoesPage.totalElements > 0 && (
          <Card.Footer className="bg-white border-0 py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="text-muted fw-medium">
              Show {shoesPage.content.length} of {shoesPage.totalElements} records
            </div>
            {shoesPage.totalPages > 1 && (
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={shoesPage.currentPage === 0}
                  onClick={() => setPage(shoesPage.currentPage - 1)}
                />
                {Array.from({ length: shoesPage.totalPages }, (_, idx) => (
                  <Pagination.Item
                    key={idx}
                    active={idx === shoesPage.currentPage}
                    onClick={() => setPage(idx)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={shoesPage.currentPage === shoesPage.totalPages - 1}
                  onClick={() => setPage(shoesPage.currentPage + 1)}
                />
              </Pagination>
            )}
          </Card.Footer>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          Are you sure you want to delete shoes "{selectedShoes?.shoesName}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete} className="px-4 py-2 fw-semibold">
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)} className="px-4 py-2 fw-semibold">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ShoesList
