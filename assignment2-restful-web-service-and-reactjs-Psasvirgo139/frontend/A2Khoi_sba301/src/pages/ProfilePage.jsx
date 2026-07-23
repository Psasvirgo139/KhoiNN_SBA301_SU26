// TODO-14: Staff quan ly profile cua chinh minh
import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { updateAccount } from '../services/accountService'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    accountName: user.accountName,
    accountEmail: user.accountEmail,
    accountPassword: ''
  })
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const updated = await updateAccount(user.accountId, {
        accountId: user.accountId,
        accountName: form.accountName,
        accountEmail: form.accountEmail,
        accountRole: user.accountRole,
        accountPassword: form.accountPassword
      })
      login(updated) // cap nhat lai context + localStorage
      setForm((prev) => ({ ...prev, accountPassword: '' }))
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (err) {
      setMessage({
        type: 'danger',
        text: JSON.stringify(err.response?.data?.message || 'Update failed')
      })
    }
  }

  return (
    <Container style={{ maxWidth: 480 }}>
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">My Profile</Card.Title>
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Account ID</Form.Label>
              <Form.Control value={user.accountId} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.accountName} required maxLength={100}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.accountEmail} required maxLength={70}
                onChange={(e) => setForm({ ...form, accountEmail: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={form.accountPassword} required maxLength={70}
                placeholder="Enter password to confirm changes"
                onChange={(e) => setForm({ ...form, accountPassword: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Update Profile</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProfilePage
