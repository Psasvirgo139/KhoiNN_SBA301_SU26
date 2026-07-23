import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, ButtonGroup, Spinner, Alert, Row, Col, Card, Badge } from 'react-bootstrap'
import { useOrchid } from '../context/OrchidContext'
import { useAuth } from '../context/AuthContext'
import OrchidTable from '../components/OrchidTable'
import ConfirmModal from '../components/ConfirmModal'

export default function HomePage() {
  const navigate = useNavigate()
  const { orchids, loading, error, fetchOrchids, removeOrchid } = useOrchid()
  const { token, currentUser } = useAuth()
  const [viewMode, setViewMode] = useState('table')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const isAdmin = currentUser?.role === 'ADMIN'
  const isLoggedIn = !!token

  useEffect(() => {
    fetchOrchids()
  }, [fetchOrchids])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeOrchid(deleteTarget.orchidId)
      setDeleteTarget(null)
    } catch (err) {
      alert('Xóa thất bại: ' + (err.response?.data?.message ?? err.message))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🌸 Danh sách Hoa Lan</h2>
        <div className="d-flex gap-2">
          <ButtonGroup>
            <Button
              variant={viewMode === 'table' ? 'dark' : 'outline-dark'}
              onClick={() => setViewMode('table')}
            >
              Bảng
            </Button>
            <Button
              variant={viewMode === 'card' ? 'dark' : 'outline-dark'}
              onClick={() => setViewMode('card')}
            >
              Thẻ
            </Button>
          </ButtonGroup>
          {token && (
            <Button variant="success" onClick={() => navigate('/add')}>
              + Thêm mới
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        viewMode === 'table' ? (
          <OrchidTable
            orchids={orchids}
            onEdit={id => navigate(`/edit/${id}`)}
            onDelete={setDeleteTarget}
          />
        ) : (
          orchids?.length ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {orchids.map((o) => (
                <Col key={o.orchidId}>
                  <Card className="h-100 shadow-sm">
                    {o.orchidURL && (
                      <Card.Img
                        variant="top"
                        src={o.orchidURL}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="d-flex justify-content-between align-items-start">
                        <span>{o.orchidName}</span>
                        {o.orchidCategory && (
                          <Badge bg="info" text="dark" className="fs-6">
                            {o.orchidCategory}
                          </Badge>
                        )}
                      </Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {o.orchidDescription || 'Không có mô tả.'}
                      </Card.Text>
                      <div className="mb-3 d-flex gap-2">
                        <Badge bg={o.isNatural ? 'success' : 'secondary'}>
                          {o.isNatural ? 'Tự nhiên' : 'Nhân tạo'}
                        </Badge>
                        <Badge bg={o.isAttractive ? 'warning' : 'light'} text="dark">
                          {o.isAttractive ? 'Hấp dẫn' : 'Không hấp dẫn'}
                        </Badge>
                      </div>
                      {isLoggedIn && (
                        <div className="d-flex gap-2 mt-auto">
                          <Button
                            variant="outline-primary"
                            className="flex-grow-1"
                            onClick={() => navigate(`/edit/${o.orchidId}`)}
                          >
                            Sửa
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline-danger"
                              className="flex-grow-1"
                              onClick={() => setDeleteTarget(o)}
                            >
                              Xóa
                            </Button>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-muted text-center mt-3">Chưa có dữ liệu.</p>
          )
        )
      )}

      <ConfirmModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        orchidName={deleteTarget?.orchidName}
        loading={deleting}
      />
    </Container>
  )
}
