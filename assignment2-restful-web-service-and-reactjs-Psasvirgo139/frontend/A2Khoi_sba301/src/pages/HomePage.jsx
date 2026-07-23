// TODO-10: Trang public - xem tin active, khong can dang nhap
import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { getPublicNews } from '../services/newsService'

function HomePage() {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPublicNews()
      .then(setNewsList)
      .catch(() => setError('Cannot load news. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>

  return (
    <Container className="mb-5">
      <h2 className="mb-4">Latest News</h2>
      {newsList.length === 0 ? (
        <p className="text-muted">No news articles found.</p>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {newsList.map((news) => (
            <Col key={news.newsArticleId}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{news.newsTitle}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {news.categoryName} | {news.createdDate?.substring(0, 10)} | by {news.createdByName}
                  </Card.Subtitle>
                  <Card.Text>{news.newsContent?.substring(0, 200)}...</Card.Text>
                  {news.tags && news.tags.map((tag) => (
                    <Badge bg="secondary" className="me-1" key={tag.tagId}>
                      {tag.tagName}
                    </Badge>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default HomePage
