// TODO-11: Popup dialog Create/Update account + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const emptyForm = { accountId: '', accountName: '', accountEmail: '', accountRole: 2, accountPassword: '' }

function AccountModal({ show, account, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(account
        ? { ...account, accountPassword: '' }
        : emptyForm)
    }
  }, [show, account])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        accountId: Number(form.accountId),
        accountName: form.accountName,
        accountEmail: form.accountEmail,
        accountRole: Number(form.accountRole),
        accountPassword: form.accountPassword
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{account ? 'Update Account' : 'Create Account'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Account ID</Form.Label>
            <Form.Control type="number" name="accountId" value={form.accountId}
              onChange={handleChange} required disabled={!!account} min={1} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="accountName" value={form.accountName}
              onChange={handleChange} required maxLength={100} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="accountEmail" value={form.accountEmail}
              onChange={handleChange} required maxLength={70} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="accountRole" value={form.accountRole} onChange={handleChange}>
              <option value={1}>Admin</option>
              <option value={2}>Staff</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="accountPassword" value={form.accountPassword}
              onChange={handleChange} required maxLength={70} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AccountModal
