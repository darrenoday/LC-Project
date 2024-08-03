import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Implement logout logic here (e.g., clearing auth tokens)
    navigate('/login'); // Redirect to login page
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                <div>
                  <Link to="/" className="btn btn-primary me-2">Home</Link>
                  <Link to="/contact" className="btn btn-info me-2">Contact</Link>
                  <Link to="/create-event" className="btn btn-success me-2">Create Event</Link>
                  <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
              <Card.Title>About the Local Event Finder</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">Meet *Celebrity Name*</Card.Subtitle>
              <Card.Text>
                *Celebrity Name* is a celebrated figure in the St. Louis community, known for their extensive knowledge and passion for local events and culture. With a career spanning *number* years, *Celebrity Name* has shared their expertise through popular articles, books, guides, and media appearances. Their deep understanding of what makes St. Louis unique has made them a trusted voice for locals and visitors alike.
              </Card.Text>
              <Card.Subtitle className="mb-3 text-muted">Our Mission</Card.Subtitle>
              <Card.Text>
                Our mission is to connect you with the best events and activities that the St. Louis metro area has to offer. Whether you're looking for a lively concert, a family-friendly festival, or a hidden gem, we've got you covered. Our curated lists are designed to provide you with only the most exciting and noteworthy events, ensuring that you always have something to look forward to.
              </Card.Text>
              <Card.Text>
                Thank you for visiting Local Event Finder. We hope you find this platform helpful and inspiring as you explore the best of St. Louis!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
