// TODO-11: Account Management (Admin) - CRUD + Search, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import {
  getAccounts, searchAccounts, createAccount, updateAccount, deleteAccount
} from '../services/accountService'
import AccountModal from '../components/AccountModal'
import ConfirmModal from '../components/ConfirmModal'

function AccountManagementPage() {
  const [accounts, setAccounts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [deletingAccount, setDeletingAccount] = useState(null)

  const loadAccounts = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchAccounts(keyword.trim()) : await getAccounts()
      setAccounts(data)
    } catch {
      setError('Cannot load accounts')
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadAccounts()
  }

  const handleSave = async (form) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.accountId, form)
      } else {
        await createAccount(form)
      }
      setShowModal(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (err) {
      throw new Error(err.message || 'Save failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccount(deletingAccount.accountId)
      setDeletingAccount(null)
      loadAccounts()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingAccount(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">Account Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name or email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingAccount(null); setShowModal(true) }}>
          + Add Account
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.accountId}>
              <td>{acc.accountId}</td>
              <td>{acc.accountName}</td>
              <td>{acc.accountEmail}</td>
              <td>{acc.accountRole === 1 ? 'Admin' : 'Staff'}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingAccount(acc); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingAccount(acc)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AccountModal
        show={showModal}
        account={editingAccount}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingAccount(null) }}
      />
      <ConfirmModal
        show={!!deletingAccount}
        message={`Delete account "${deletingAccount?.accountName}"? An account that has created news articles cannot be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAccount(null)}
      />
    </Container>
  )
}

export default AccountManagementPage
