import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Alert, Breadcrumb, Spinner } from 'react-bootstrap'
import { getOrchidById } from '../utils/orchidApi'
import { useOrchid } from '../context/OrchidContext'
import OrchidForm from '../components/OrchidForm'

export default function EditOrchidPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editOrchid } = useOrchid()
  const [orchid, setOrchid] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getOrchidById(id)
      .then(res => setOrchid(res.data))
      .catch(() => setError('Không tìm thấy hoa lan với ID: ' + id))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true)
    setError('')
    try {
      await editOrchid(Number(id), data)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Cập nhật thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Sửa #{id}</Breadcrumb.Item>
      </Breadcrumb>
      <h3 className="mb-4">✏️ Sửa hoa lan #{id}</h3>
      {fetching && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {!fetching && error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Cập nhật thành công! Đang chuyển về trang chủ...</Alert>}
      {!fetching && orchid && (
        <OrchidForm
          initialData={orchid}
          onSubmit={handleSubmit}
          submitLabel="Cập nhật"
          loading={saving}
        />
      )}
    </Container>
  )
}
