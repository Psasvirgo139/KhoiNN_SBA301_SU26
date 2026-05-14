import MyProfile from './components/MyProfile';
import orchids from './data/orchids';
import student from './data/students';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

function App() {

  return (
    <div className="App">

      {/* Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            Single Page Application
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile */}
      <Container className="mt-4">
        <MyProfile student={student} />
      </Container>

      {/* Carousel */}
      <Container className="mt-4">
        <Carousel>
          {orchids.slice(0, 3).map((orchid, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={orchid.image}
                alt={orchid.name}
                style={{ height: "500px", objectFit: "cover" }}
              />

              <Carousel.Caption>
                <h3>{orchid.name}</h3>
                <p>Category: {orchid.category}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Card list */}
      <Container className="mt-5">
        <Row className="g-4">
          {orchids.map((orchid) => (
            <Col md={3} key={orchid.id}>
              <Card>
                <Card.Img 
                  variant="top" 
                  src={orchid.image}  
                  style={{
                    height: "250px",
                    objectFit: "cover"
                  }}/>
                <Card.Body>
                  <Card.Title>{orchid.name}</Card.Title>
                  <Button variant="primary">Detail</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;