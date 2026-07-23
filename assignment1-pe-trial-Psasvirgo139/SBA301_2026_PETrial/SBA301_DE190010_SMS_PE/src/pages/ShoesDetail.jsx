import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Row, Col, Button, ListGroup } from 'react-bootstrap'
import { getShoesById } from '../services/shoesService'

export const ShoesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shoes, setShoes] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadShoesDetails = async () => {
      try {
        const data = await getShoesById(id)
        setShoes(data)
      } catch (err) {
        console.error('Error fetching shoes details:', err)
        setError('Shoes not found or server error.')
      }
    }
    loadShoesDetails()
  }, [id])

  // Formats date from yyyy-MM-dd to dd/MM/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const dateOnly = dateStr.split('T')[0]
      const parts = dateOnly.split('-')
      if (parts.length === 3) {
        const [yyyy, mm, dd] = parts
        return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`
      }
    } catch (e) {
      console.error('Error formatting date:', e)
    }
    return dateStr
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow border-0 p-5 rounded-3 bg-white">
          <h2 className="text-danger fw-bold mb-3">Error</h2>
          <p className="text-muted fs-5 mb-4">{error}</p>
          <div>
            <Button variant="primary" onClick={() => navigate('/')} className="px-4 py-2">
              Back to List
            </Button>
          </div>
        </Card>
      </Container>
    )
  }

  if (!shoes) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden bg-white mx-auto" style={{ maxWidth: '700px' }}>
        <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
          <h2 className="mb-1 fw-bold">Shoes Details</h2>
          <p className="mb-0 opacity-75">Full detailed information of the shoes product</p>
        </div>
        <Card.Body className="p-4">
          <ListGroup variant="flush">
            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Shoes Name</span>
              <span className="fw-bold text-dark fs-5">{shoes.shoesName}</span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Category</span>
              <span className="badge bg-info text-info-emphasis rounded-pill px-3 py-2 fw-bold">
                {shoes.categoryName || shoes.category?.categoryName || '-'}
              </span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Manufacturer</span>
              <span className="fw-semibold text-dark">{shoes.manufacturer}</span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Price</span>
              <span className="fw-bold text-primary fs-5">{shoes.price?.toLocaleString()} đ</span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Quantity</span>
              <span className="fw-semibold text-dark">{shoes.quantity}</span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Production Date</span>
              <span className="fw-semibold text-dark">{formatDate(shoes.productionDate)}</span>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 px-0 border-light d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">Import Date</span>
              <span className="fw-semibold text-dark">{formatDate(shoes.importDate)}</span>
            </ListGroup.Item>
          </ListGroup>

          <div className="text-center mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/')}
              className="px-5 py-2 fw-semibold rounded-pill"
            >
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ShoesDetail
