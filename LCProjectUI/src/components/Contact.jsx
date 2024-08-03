import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:8080/contact', formData)
      .then(response => {
        setResponseMessage(response.data);
        setErrorMessage('');
        // Optionally, reset the form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      })
      .catch(error => {
        setErrorMessage('There was an error submitting the form. Please try again.');
        setResponseMessage('');
      });
  };

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
                <Button variant="primary" onClick={() => navigate('/')}>Home</Button>
                <Button variant="secondary" onClick={() => navigate('/about')}>About</Button>
                <Button variant="success" onClick={() => navigate('/create-event')}>Create Event</Button>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button> {/* Back Button */}
                <h1 className="ms-3">Contact Us</h1>
              </div>
              <Card.Text>
                We love hearing from you! Whether you have questions, suggestions, or just want to share your event experiences, feel free to reach out to us using the form below. Our team is here to assist you and ensure you have the best possible experience with Local Event Finder.
              </Card.Text>
              {responseMessage && <div className="alert alert-success">{responseMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formSubject" className="mt-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formMessage" className="mt-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={4}
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
