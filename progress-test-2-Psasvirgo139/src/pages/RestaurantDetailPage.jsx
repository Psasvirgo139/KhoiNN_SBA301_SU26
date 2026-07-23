import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { getRestaurantById } from '../services/restaurantService'
import { MESSAGES } from '../constants/messages'

/**
 * RestaurantDetailPage — Screen 3: Xem chi tiết restaurant.
 *
 * Chức năng:
 *  1. Đọc :id từ URL params
 *  2. Gọi API lấy chi tiết restaurant
 *  3. Hiển thị đầy đủ thông tin: Name, Owner, Category, Price range, Address, Open Date
 *  4. Hiển thị MS05 nếu API lỗi
 */
function RestaurantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // TODO: Gọi loadRestaurant() khi id thay đổi
    loadRestaurant()
  }, [id])

  async function loadRestaurant() {
    // TODO: Gọi getRestaurantById(id)
    // TODO: setRestaurant(data)
    // TODO: Nếu lỗi → setErrorMsg(MESSAGES.MS05)
    try {
      const data = await getRestaurantById(id)
      setRestaurant(data)
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  return (
    <>
      <Header />
      <Container className="my-4">
        <h4>VIEW DETAILS</h4>

        {/* TODO: Hiển thị errorMsg nếu có */}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {restaurant && (
          <Card className="p-3">
            <Card.Body>
              {/* TODO: Hiển thị từng trường thông tin theo layout:
                  Label (cột trái) : Value (cột phải) */}
              <Row className="mb-2">
                <Col md={3}><strong>Restaurant Name:</strong></Col>
                {/* TODO: <Col>{restaurant.name}</Col> */}
                <Col>{restaurant.name}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}><strong>Owner name:</strong></Col>
                {/* TODO: <Col>{restaurant.owner}</Col> */}
                <Col>{restaurant.owner}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}><strong>Category:</strong></Col>
                {/* TODO: <Col>{restaurant.category}</Col> */}
                <Col>{restaurant.category}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}><strong>Price range (đ):</strong></Col>
                {/* TODO: Hiển thị priceFrom – priceTo */}
                <Col>
                  {restaurant.priceFrom?.toLocaleString()} – {restaurant.priceTo?.toLocaleString()}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}><strong>Address:</strong></Col>
                {/* TODO: <Col>{restaurant.address}</Col> */}
                <Col>{restaurant.address}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}><strong>Open Date:</strong></Col>
                {/* TODO: <Col>{restaurant.openDate}</Col> */}
                <Col>{restaurant.openDate}</Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* TODO: Nút Back → navigate('/') */}
        <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>
          Back
        </Button>
      </Container>
      <Footer />
    </>
  )
}

export default RestaurantDetailPage
