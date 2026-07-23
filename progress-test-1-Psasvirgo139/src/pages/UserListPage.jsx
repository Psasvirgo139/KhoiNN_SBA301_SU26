import { useEffect, useState } from 'react'
import { Alert, Table, Container, Badge } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { getUsers } from '../services/userService'

export default function UserListPage() {
  const { state } = useAuth()
  const { user } = state
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (user?.role === 'admin') {
      getUsers().then((data) => {
        setUsers(data)
      })
    }
  }, [user])

  if (user?.role !== 'admin') {
    return (
      <Container className="py-5">
        <Alert variant="danger" data-testid="access-denied" className="shadow-sm">
          Bạn không có quyền truy cập trang này.
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient mb-0">Danh sách Người dùng</h2>
        <Badge bg="dark" className="fs-6 py-2 px-3 rounded-pill shadow-sm">
          Tổng số: {users.length}
        </Badge>
      </div>
      
      <div className="table-responsive shadow-lg rounded-4 overflow-hidden">
        <Table hover className="mb-0 align-middle">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="py-3 ps-4 text-secondary text-uppercase font-size-xs fw-bold">#</th>
              <th className="py-3 text-secondary text-uppercase font-size-xs fw-bold">Username</th>
              <th className="py-3 text-secondary text-uppercase font-size-xs fw-bold">Name</th>
              <th className="py-3 text-secondary text-uppercase font-size-xs fw-bold">Role</th>
              <th className="py-3 pe-4 text-secondary text-uppercase font-size-xs fw-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className="transition-all">
                <td className="py-3 ps-4 fw-semibold text-muted">{index + 1}</td>
                <td className="py-3 fw-bold text-dark">{u.username}</td>
                <td className="py-3 text-secondary">{u.name}</td>
                <td className="py-3">
                  <Badge
                    bg={u.role === 'admin' ? 'danger' : 'success'}
                    className="px-2.5 py-1.5 rounded-3 text-uppercase font-size-xs"
                  >
                    {u.role}
                  </Badge>
                </td>
                <td className="py-3 pe-4">
                  <Badge
                    bg={u.status === 'active' ? 'primary' : 'secondary'}
                    className="px-2.5 py-1.5 rounded-3 text-uppercase font-size-xs"
                  >
                    {u.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  )
}
