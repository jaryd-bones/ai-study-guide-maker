import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email, password);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="h4 mb-3 text-center">Log In</h1>

      <Form.Group className="mb-3" controlId="login-email">
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

      <Form.Group className="mb-3" controlId="login-password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
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
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm