import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const AuthForm = ({ mode, onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email, password, isRegister ? name : undefined);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="h4 mb-3 text-center">
        {isRegister ? "Create an Account" : "Log In"}
      </h1>

      {isRegister && (
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name (optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3" controlId="email">
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

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
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
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Loading...
            </>
          ) : isRegister ? (
            "Sign Up"
          ) : (
            "Log In"
          )}
        </Button>
      </div>
    </Form>
  );
}

export default AuthForm