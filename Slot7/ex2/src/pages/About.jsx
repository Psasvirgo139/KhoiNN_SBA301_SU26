// src/pages/About.jsx
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';

function About() {
  const techs = [
    { name: 'React 18', color: 'primary' },
    { name: 'React Router v6', color: 'success' },
    { name: 'React-Bootstrap', color: 'info' },
    { name: 'Bootstrap 5', color: 'secondary' },
  ];

  return (
    <Container className="py-5" style={{ maxWidth: 700 }}>
      <Card className='shadow-sm'>
        <Card.Header className='bg-primary text-white'>
          <h4 className='mb-0'>ℹ️ Giới thiệu</h4>
        </Card.Header>
        <Card.Body>
          <p>Blog này được xây dựng như một dự án học tập môn SBA301.</p>
          <h6 className='mt-3'>Công nghệ sử dụng:</h6>
          <div className='d-flex flex-wrap gap-2'>
            {techs.map(t => (
              <Badge key={t.name} bg={t.color}>{t.name}</Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default About;
