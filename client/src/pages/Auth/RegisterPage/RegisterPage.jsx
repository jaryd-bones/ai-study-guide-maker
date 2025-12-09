import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.js";
import RegisterForm from "./RegisterForm.jsx";
import { Container, Row, Col, Card } from "react-bootstrap";

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password, firstName, lastName }) => {
    try {
      setError(null);

      await register({
        email,
        password,
        firstName,
        lastName,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let message = "Registration failed";

      if (Array.isArray(detail) && detail.length > 0) {
        message = detail.map((d) => d.msg).join(" ");
      } else if (typeof detail === "string") {
        message = detail;
      }

      setError(message);
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <Card className="shadow-sm auth-card">
            <Card.Body>
              <RegisterForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link to="/login">Log in</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage