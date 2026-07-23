import { Table, Button, Badge, Image } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function OrchidTable({ orchids, onEdit, onDelete }) {
  const { token, currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'ADMIN'
  const isLoggedIn = !!token

  if (!orchids?.length) {
    return <p className="text-muted text-center mt-3">Chưa có dữ liệu.</p>
  }

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Ảnh</th>
          <th>Tên</th>
          <th>Danh mục</th>
          <th>Tự nhiên</th>
          <th>Hấp dẫn</th>
          <th>Mô tả</th>
          {isLoggedIn && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {orchids.map((o, i) => (
          <tr key={o.orchidId}>
            <td>{i + 1}</td>
            <td>
              {o.orchidURL && (
                <Image
                  src={o.orchidURL}
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover' }}
                  rounded
                />
              )}
            </td>
            <td>{o.orchidName}</td>
            <td>{o.orchidCategory}</td>
            <td>
              <Badge bg={o.isNatural ? 'success' : 'secondary'}>
                {o.isNatural ? 'Có' : 'Không'}
              </Badge>
            </td>
            <td>
              <Badge bg={o.isAttractive ? 'warning' : 'light'} text="dark">
                {o.isAttractive ? 'Có' : 'Không'}
              </Badge>
            </td>
            <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {o.orchidDescription}
            </td>
            {isLoggedIn && (
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => onEdit(o.orchidId)}
                >
                  Sửa
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(o)}
                  >
                    Xóa
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
