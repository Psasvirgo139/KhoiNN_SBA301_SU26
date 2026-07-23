import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { addRestaurant } from '../services/restaurantService'
import { getCategories } from '../services/categoryService'
import { validateRestaurantForm } from '../utils/validators'
import { MESSAGES } from '../constants/messages'

/**
 * AddNewRestaurantPage — Screen 4: Thêm mới restaurant.
 *
 * Chức năng:
 *  1. Load categories từ API để render dropdown
 *  2. Validate toàn bộ form khi click Save (xem validators.js)
 *  3. Hiển thị lỗi inline bên dưới từng field (màu đỏ)
 *  4. Gọi POST API nếu form hợp lệ → hiển thị MS04 (màu xanh)
 *  5. Nút Back → về RestaurantListPage
 *  6. Hiển thị MS05 nếu API lỗi
 *
 * Validation rules (xem validators.js):
 *  - Tất cả field: bắt buộc (MS01)
 *  - Price from: số nguyên, 1000–999999 (MS02)
 *  - Price to: số nguyên, 1000–999999, > Price from (MS02)
 *  - Open Date: format yyyy-MM-dd, không phải tương lai (MS06)
 */
function AddNewRestaurantPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    priceFrom: '',
    priceTo: '',
    owner: '',
    openDate: '',
    address: '',
    category: '',
  })

  // errors: object { name, priceFrom, priceTo, priceRange, owner, openDate, address, category }
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // TODO: Gọi loadCategories() khi mount
    loadCategories()
  }, [])

  async function loadCategories() {
    // TODO: Gọi getCategories()
    // TODO: setCategories(data)
    // TODO: Nếu lỗi → setErrorMsg(MESSAGES.MS05)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    // TODO: Cập nhật formData bằng spread: setFormData({ ...formData, [name]: value })
    setFormData((prev) => ({ ...prev, [name]: value }))
    // TODO: Xóa lỗi của field vừa thay đổi: setErrors({ ...errors, [name]: null })
    setErrors((prev) => {
      const nextErrors = { ...prev, [name]: null }
      if (name === 'priceFrom' || name === 'priceTo') {
        nextErrors.priceRange = null
      }
      return nextErrors
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // TODO: Gọi validateRestaurantForm(formData) → lấy errors object
    const validationErrors = validateRestaurantForm(formData)

    // TODO: Kiểm tra có lỗi nào không (Object.values(errors).some(v => v !== null))
    const hasErrors = Object.values(validationErrors).some((v) => v !== null)

    if (hasErrors) {
      // TODO: setErrors(validationErrors) để hiển thị lỗi inline
      setErrors(validationErrors)
      return
    }

    // TODO: Nếu hợp lệ → gọi addRestaurant(formData)
    // TODO: setSuccessMsg(MESSAGES.MS04)
    // TODO: Reset form
    // TODO: Nếu lỗi API → setErrorMsg(MESSAGES.MS05)
    try {
      setErrorMsg('')
      setSuccessMsg('')
      await addRestaurant(formData)
      setSuccessMsg(MESSAGES.MS04)
      setFormData({
        name: '',
        priceFrom: '',
        priceTo: '',
        owner: '',
        openDate: '',
        address: '',
        category: '',
      })
      setErrors({})
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  return (
    <>
      <Header />
      <Container className="my-4">
        <h4>Add New Restaurant</h4>

        {/* TODO: Hiển thị successMsg (variant="success") */}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        {/* TODO: Hiển thị errorMsg (variant="danger") */}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Restaurant Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Restaurant name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
            />
            {/* TODO: Hiển thị errors.name bằng <Form.Text className="text-danger"> */}
            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
          </Form.Group>

          {/* Price from / Price to */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="priceFrom">
                <Form.Label>Price from (đ)</Form.Label>
                <Form.Control
                  type="number"
                  name="priceFrom"
                  value={formData.priceFrom}
                  onChange={handleChange}
                />
                {/* TODO: Hiển thị errors.priceFrom */}
                {errors.priceFrom && (
                  <Form.Text className="text-danger">{errors.priceFrom}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="priceTo">
                <Form.Label>Price to (đ)</Form.Label>
                <Form.Control
                  type="number"
                  name="priceTo"
                  value={formData.priceTo}
                  onChange={handleChange}
                />
                {/* TODO: Hiển thị errors.priceTo và errors.priceRange */}
                {errors.priceTo && (
                  <Form.Text className="text-danger">{errors.priceTo}</Form.Text>
                )}
                {errors.priceRange && (
                  <Form.Text className="text-danger">{errors.priceRange}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              maxLength={100}
            />
            {/* TODO: Hiển thị errors.address */}
            {errors.address && <Form.Text className="text-danger">{errors.address}</Form.Text>}
          </Form.Group>

          {/* Owner name */}
          <Form.Group className="mb-3" controlId="owner">
            <Form.Label>Owner name</Form.Label>
            <Form.Control
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              maxLength={100}
            />
            {/* TODO: Hiển thị errors.owner */}
            {errors.owner && <Form.Text className="text-danger">{errors.owner}</Form.Text>}
          </Form.Group>

          {/* Open Date */}
          <Form.Group className="mb-3" controlId="openDate">
            <Form.Label>Open Date</Form.Label>
            <Form.Control
              type="date"
              name="openDate"
              value={formData.openDate}
              onChange={handleChange}
            />
            {/* TODO: Hiển thị errors.openDate */}
            {errors.openDate && <Form.Text className="text-danger">{errors.openDate}</Form.Text>}
          </Form.Group>

          {/* Category */}
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange}>
              <option value="">-- Select Category --</option>
              {/* TODO: Map categories → option */}
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </Form.Select>
            {/* TODO: Hiển thị errors.category */}
            {errors.category && <Form.Text className="text-danger">{errors.category}</Form.Text>}
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex gap-2">
            {/* TODO: Nút Save type="submit" */}
            <Button type="submit" variant="primary">Save</Button>
            {/* TODO: Nút Back → navigate('/') */}
            <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  )
}

export default AddNewRestaurantPage
