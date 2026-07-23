import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { createShoes, getCategories, searchShoes } from '../services/shoesService'

export const AddShoes = () => {
  const navigate = useNavigate()

  // Form Fields State
  const [shoesName, setShoesName] = useState('')
  const [price, setPrice] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [productionDate, setProductionDate] = useState('')
  const [importDate, setImportDate] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Categories Dropdown State
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Date helper from TODOs
  const isValidDate = (s) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false
    const [d, m, y] = s.split('/').map(Number)
    const date = new Date(y, m - 1, d)
    return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y
  }

  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  const convertDateToYmd = (s) => {
    if (!s) return null
    const [d, m, y] = s.split('/')
    return `${y}-${m}-${d}`
  }

  // Check duplicate shoesName using search API
  const checkNameDuplicate = async (name) => {
    try {
      const data = await searchShoes(name, '', 0, 1000)
      return data.content.some(
        (s) => s.shoesName.trim().toLowerCase() === name.trim().toLowerCase()
      )
    } catch (err) {
      console.error('Error checking duplicate name:', err)
      return false
    }
  }

  const validateForm = async () => {
    const tempErrors = {}

    // 1. Shoes Name Validation
    if (!shoesName.trim()) {
      tempErrors.shoesName = 'Shoes Name is required.'
    } else if (shoesName.length > 100) {
      tempErrors.shoesName = 'Shoes Name must be 100 characters or less.'
    } else {
      const isDuplicate = await checkNameDuplicate(shoesName)
      if (isDuplicate) {
        tempErrors.shoesName = 'Shoes Name already exists.'
      }
    }

    // 2. Price Validation
    const numericPrice = Number(price)
    if (!price || price.trim() === '') {
      tempErrors.price = 'Price is required.'
    } else if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice >= 10000) {
      tempErrors.price = 'Price must be a number greater than 0 and less than 10000.'
    }

    // 3. Manufacturer Validation
    if (!manufacturer.trim()) {
      tempErrors.manufacturer = 'Manufacturer is required.'
    } else if (manufacturer.length > 100) {
      tempErrors.manufacturer = 'Manufacturer must be 100 characters or less.'
    }

    // 4. Production Date Validation
    if (!productionDate.trim()) {
      tempErrors.productionDate = 'Production Date is required.'
    } else if (!isValidDate(productionDate)) {
      tempErrors.productionDate = 'Production Date must be in dd/MM/yyyy format and be a valid date.'
    }

    // 5. Import Date Validation
    if (importDate.trim() && !isValidDate(importDate)) {
      tempErrors.importDate = 'Import Date must be in dd/MM/yyyy format and be a valid date.'
    }

    // 6. Category Validation
    if (!categoryId) {
      tempErrors.categoryId = 'Category selection is required.'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const isValid = await validateForm()
    if (isValid) {
      try {
        const payload = {
          shoesName: shoesName.trim(),
          price: Number(price),
          quantity: 0,
          manufacturer: manufacturer.trim(),
          productionDate: convertDateToYmd(productionDate),
          importDate: importDate.trim() ? convertDateToYmd(importDate) : null,
          categoryId: Number(categoryId),
        }
        await createShoes(payload)
        navigate('/', { state: { message: 'Created new shoes successfully' } })
      } catch (err) {
        console.error('Error saving shoes:', err)
        setErrors((prev) => ({
          ...prev,
          general: 'Failed to create shoes due to a server error.',
        }))
      }
    }
    setIsLoading(false)
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden bg-white mx-auto" style={{ maxWidth: '750px' }}>
        <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
          <h2 className="mb-1 fw-bold">Add New Shoes</h2>
          <p className="mb-0 opacity-75">Fill in the fields below to add a new product to inventory</p>
        </div>
        <Card.Body className="p-4">
          {errors.general && (
            <Alert variant="danger" className="mb-4 shadow-sm">
              {errors.general}
            </Alert>
          )}

          <Form onSubmit={handleSave}>
            <Row className="g-3">
              {/* Shoes Name */}
              <Col md={12}>
                <Form.Group controlId="formShoesName">
                  <Form.Label className="fw-semibold text-secondary">Shoes Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter shoes name (e.g. Nike Air Max)"
                    value={shoesName}
                    onChange={(e) => setShoesName(e.target.value)}
                    isInvalid={!!errors.shoesName}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shoesName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Category */}
              <Col md={6}>
                <Form.Group controlId="formCategory">
                  <Form.Label className="fw-semibold text-secondary">Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    isInvalid={!!errors.categoryId}
                    className="py-2"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoryId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Price */}
              <Col md={6}>
                <Form.Group controlId="formPrice">
                  <Form.Label className="fw-semibold text-secondary">Price (đ) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    placeholder="Enter price (0 < price < 10000)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    isInvalid={!!errors.price}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Manufacturer */}
              <Col md={12}>
                <Form.Group controlId="formManufacturer">
                  <Form.Label className="fw-semibold text-secondary">Manufacturer <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter manufacturer name (e.g. Nike Inc.)"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    isInvalid={!!errors.manufacturer}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.manufacturer}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Production Date */}
              <Col md={6}>
                <Form.Group controlId="formProductionDate">
                  <Form.Label className="fw-semibold text-secondary">Production Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="dd/MM/yyyy"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    isInvalid={!!errors.productionDate}
                    className="py-2"
                  />
                  <Form.Text className="text-muted">
                    Format: dd/MM/yyyy (e.g., 25/12/2025)
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.productionDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Import Date */}
              <Col md={6}>
                <Form.Group controlId="formImportDate">
                  <Form.Label className="fw-semibold text-secondary">Import Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="dd/MM/yyyy"
                    value={importDate}
                    onChange={(e) => setImportDate(e.target.value)}
                    isInvalid={!!errors.importDate}
                    className="py-2"
                  />
                  <Form.Text className="text-muted">
                    Format: dd/MM/yyyy (Optional)
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.importDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 pt-2 d-flex justify-content-end gap-3">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/')}
                className="px-4 py-2 fw-semibold"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="success"
                className="px-4 py-2 fw-semibold shadow-sm"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', border: 'none' }}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AddShoes
