// TODO-13: News Article Management (Staff) - CRUD + Search + tags, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import { getNews, searchNews, createNews, updateNews, deleteNews } from '../services/newsService'
import { getCategories } from '../services/categoryService'
import { getTags } from '../services/tagService'
import { useAuth } from '../context/AuthContext'
import NewsModal from '../components/NewsModal'
import ConfirmModal from '../components/ConfirmModal'

function NewsManagementPage() {
  const [newsList, setNewsList] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [deletingNews, setDeletingNews] = useState(null)
  const { user } = useAuth()

  const loadNews = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchNews(keyword.trim()) : await getNews()
      setNewsList(data)
    } catch {
      setError('Cannot load news articles')
    }
  }

  useEffect(() => {
    loadNews()
    getCategories().then(setCategories).catch(() => {})
    getTags().then(setTags).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadNews()
  }

  const handleSave = async (form) => {
    try {
      const payload = { ...form, createdById: user.accountId }
      if (editingNews) {
        await updateNews(editingNews.newsArticleId, payload)
      } else {
        await createNews(payload)
      }
      setShowModal(false)
      setEditingNews(null)
      loadNews()
    } catch (err) {
      throw new Error(err.message || 'Save failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNews(deletingNews.newsArticleId)
      setDeletingNews(null)
      loadNews()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingNews(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">News Article Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by title or headline..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingNews(null); setShowModal(true) }}>
          + Add News
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Tags</th><th>Status</th><th>Created By</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news.newsArticleId}>
              <td>{news.newsArticleId}</td>
              <td>{news.newsTitle}</td>
              <td>{news.categoryName}</td>
              <td>
                {news.tags && news.tags.map((tag) => (
                  <Badge bg="info" className="me-1" key={tag.tagId}>{tag.tagName}</Badge>
                ))}
              </td>
              <td>
                <Badge bg={news.newsStatus ? 'success' : 'secondary'}>
                  {news.newsStatus ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>{news.createdByName}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingNews(news); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingNews(news)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <NewsModal
        show={showModal}
        news={editingNews}
        categories={categories}
        tags={tags}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingNews(null) }}
      />
      <ConfirmModal
        show={!!deletingNews}
        message={`Delete news article "${deletingNews?.newsTitle}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingNews(null)}
      />
    </Container>
  )
}

export default NewsManagementPage
