import { Row, Col, Button } from "react-bootstrap";

const FlashcardFilterBar = ({ filter, onFilterChange }) => {
  const filterLabel = (type) =>
    type === "all"
      ? "All"
      : type === "needs_review"
      ? "Needs Review"
      : "Memorized";

  return (
    <Row className="align-items-center mb-3">
      <Col>
        <h2 className="h5 mb-0">Flashcards</h2>
      </Col>
      <Col xs="auto">
        <div className="d-flex align-items-center gap-2">
          <span className="small">Filter:</span>
          {["all", "needs_review", "memorized"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? "primary" : "outline-secondary"}
              onClick={() => onFilterChange(type)}
            >
              {filterLabel(type)}
            </Button>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default FlashcardFilterBar;
