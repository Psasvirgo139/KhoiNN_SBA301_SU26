import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { addCategory, getCategories } from '../services/categoryService'
import { validateCategoryForm } from '../utils/validators'
import { MESSAGES } from '../constants/messages'

/**
 * AddCategoryPage — Trang Thêm danh mục mới.
 *
 * Chức năng:
 *  1. Load danh sách categories để validate trùng id/name
 *  2. Validate form khi click Save:
 *     - id, name không được rỗng
 *     - id, name không được trùng với dữ liệu đã có
 *     - name phải dài từ 6 ký tự trở lên
 *  3. Hiển thị lỗi inline bên dưới từng input field
 *  4. Gọi POST API lưu danh mục mới -> Chuyển hướng sang trang danh sách danh mục (/categories)
 */
function AddCategoryPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    id: '',
    name: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      // Lấy danh sách mới nhất từ server trước khi validate để tránh race condition
      const latestCategories = await getCategories()
      setCategories(latestCategories)

      const validationErrors = validateCategoryForm(formData, latestCategories)
      const hasErrors = Object.values(validationErrors).some((v) => v !== null)

      if (hasErrors) {
        setErrors(validationErrors)
        return
      }

      setErrorMsg('')
      setSuccessMsg('')
      
      // Thực hiện POST API
      await addCategory({
        id: formData.id.trim(),
        name: formData.name.trim(),
      })

      // Điều hướng về trang danh sách với thông điệp thành công
      navigate('/categories', {
        state: { successMsg: 'Category created successfully!' },
      })
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  return (
    <>
      <Header />
      <Container className="my-5 d-flex justify-content-center">
        <Card className="shadow-lg border-0" style={{ width: '100%', maxWidth: '600px', borderRadius: '15px' }}>
          <Card.Header className="bg-primary text-white text-center py-3" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
            <h4 className="mb-0 fw-bold">Add New Category</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Category ID */}
              <Form.Group className="mb-4" controlId="categoryId">
                <Form.Label className="fw-semibold">Category ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  placeholder="Enter category ID (e.g., 6)"
                  value={formData.id}
                  onChange={handleChange}
                  className={errors.id ? 'is-invalid' : ''}
                />
                {errors.id && (
                  <Form.Text className="text-danger fw-medium d-block mt-1">
                    {errors.id}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Category Name */}
              <Form.Group className="mb-4" controlId="categoryName">
                <Form.Label className="fw-semibold">Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter category name (minimum 6 characters)"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'is-invalid' : ''}
                />
                {errors.name && (
                  <Form.Text className="text-danger fw-medium d-block mt-1">
                    {errors.name}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-end mt-4">
                <Button variant="secondary" onClick={() => navigate('/categories')} className="px-4 py-2 fw-semibold">
                  Back to List
                </Button>
                <Button type="submit" variant="primary" className="px-5 py-2 fw-semibold shadow-sm">
                  Save
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  )
}

export default AddCategoryPage
