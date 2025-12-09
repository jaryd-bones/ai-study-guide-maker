import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.js"
import LoginForm from "./LoginForm.jsx";
import { Container, Row, Col, Card } from "react-bootstrap";

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (email, password) => {
    try {
      setError(null);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <Card className="shadow-sm auth-card">
            <Card.Body>
              <LoginForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
              <p className="mt-3 text-center">
                Don&apos;t have an account?{" "}
                <Link to="/register">Sign up</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage