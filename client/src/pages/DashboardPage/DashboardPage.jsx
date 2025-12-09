import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudyGuides } from "../../services/studyGuidesApi.js";
import StudyGuideListItem from "./StudyGuideListItem.jsx";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";

const DashboardPage = () => {
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStudyGuides();
        setGuides(data || []);
      } catch (err) {
        console.error("Failed to fetch study guides:", err);
        setError("Could not load study guides.");
      } finally {
        setIsLoading(false);
      }
    }

    loadGuides();
  }, []);

  if (isLoading) {
    return (
      <Container
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-3">Loading your study guides…</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h1 className="h3 mb-0">Your Study Guides</h1>
        </Col>
        <Col xs="auto">
          <Button
            as={Link}
            to="/study-guides/new"
            variant="primary"
            className="d-flex align-items-center gap-2"
          >
            <PlusLg size={15} />
            New Study Guide
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {!error && guides.length === 0 && (
        <p className="text-center">
          You don&apos;t have any study guides yet. Try creating one!
        </p>
      )}

      {!error && guides.length > 0 && (
        <Row className="mt-3">
          <Col>
            <div className="d-flex flex-column gap-4 mt-3">
              {guides.map((guide) => (
                <StudyGuideListItem key={guide.id} guide={guide} />
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default DashboardPage