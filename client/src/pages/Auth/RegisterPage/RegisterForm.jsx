import { useState } from "react";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";

const RegisterForm = ({ onSubmit, isLoading, error }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError(null);

    await onSubmit({
      email,
      password,
      firstName,
      lastName
    });
  }

  const displayError =
    typeof (localError || error) === "string"
      ? localError || error
      : "Something went wrong. Please try again.";

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="h4 mb-3 text-center">Create an Account</h1>

      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="register-first-name">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="register-last-name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="register-email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="register-password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {(localError || error) && (
        <Alert variant="danger" className="mb-3">
          {displayError}
        </Alert>
      )}

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
    </Form>
  );
}

export default RegisterForm