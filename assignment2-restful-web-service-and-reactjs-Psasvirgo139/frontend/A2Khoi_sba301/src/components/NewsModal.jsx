// TODO-13: Popup dialog Create/Update news article (kem tags) + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'

const emptyForm = {
  newsArticleId: '', newsTitle: '', headline: '', newsContent: '',
  newsSource: '', categoryId: '', newsStatus: true, tagIds: []
}

function NewsModal({ show, news, categories, tags, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(news
        ? {
            newsArticleId: news.newsArticleId,
            newsTitle: news.newsTitle ?? '',
            headline: news.headline ?? '',
            newsContent: news.newsContent ?? '',
            newsSource: news.newsSource ?? '',
            categoryId: news.categoryId ?? '',
            newsStatus: !!news.newsStatus,
            tagIds: news.tags.map((t) => t.tagId)
          }
        : emptyForm)
    }
  }, [show, news])

  const toggleTag = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        newsArticleId: form.newsArticleId,
        newsTitle: form.newsTitle,
        headline: form.headline,
        newsContent: form.newsContent,
        newsSource: form.newsSource,
        categoryId: Number(form.categoryId),
        newsStatus: form.newsStatus,
        tagIds: form.tagIds
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{news ? 'Update News Article' : 'Create News Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>News ID</Form.Label>
                <Form.Control value={form.newsArticleId} required maxLength={20} disabled={!!news}
                  onChange={(e) => setForm({ ...form, newsArticleId: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control value={form.newsTitle} required maxLength={400}
                  onChange={(e) => setForm({ ...form, newsTitle: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Headline</Form.Label>
            <Form.Control value={form.headline} required maxLength={150}
              onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={5} value={form.newsContent} maxLength={4000}
              onChange={(e) => setForm({ ...form, newsContent: e.target.value })} />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Control value={form.newsSource} maxLength={400}
                  onChange={(e) => setForm({ ...form, newsSource: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={form.categoryId} required
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">-- Select category --</option>
                  {categories && categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div>
              {tags && tags.map((tag) => (
                <Form.Check
                  inline
                  key={tag.tagId}
                  type="checkbox"
                  label={tag.tagName}
                  checked={form.tagIds.includes(tag.tagId)}
                  onChange={() => toggleTag(tag.tagId)}
                />
              ))}
            </div>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Active"
            checked={form.newsStatus}
            onChange={(e) => setForm({ ...form, newsStatus: e.target.checked })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default NewsModal
