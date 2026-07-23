// TODO-14: Lich su tin da tao boi staff dang dang nhap
import { useEffect, useState } from 'react'
import { Alert, Badge, Container, Table } from 'react-bootstrap'
import { getNewsHistory } from '../services/newsService'
import { useAuth } from '../context/AuthContext'

function NewsHistoryPage() {
  const [newsList, setNewsList] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getNewsHistory(user.accountId)
      .then(setNewsList)
      .catch(() => setError('Cannot load news history'))
  }, [user.accountId])

  return (
    <Container>
      <h2 className="mb-4">My News History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Created</th><th>Modified</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news.newsArticleId}>
              <td>{news.newsArticleId}</td>
              <td>{news.newsTitle}</td>
              <td>{news.categoryName}</td>
              <td>{news.createdDate?.substring(0, 10)}</td>
              <td>{news.modifiedDate?.substring(0, 10) || '-'}</td>
              <td>
                <Badge bg={news.newsStatus ? 'success' : 'secondary'}>
                  {news.newsStatus ? 'Active' : 'Inactive'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {newsList.length === 0 && !error && <p className="text-muted">You have not created any news articles yet.</p>}
    </Container>
  )
}

export default NewsHistoryPage
