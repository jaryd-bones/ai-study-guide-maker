import { Modal, Form, Button, Alert } from "react-bootstrap";

const SessionSetupModal = ({
  show,
  setupError,
  cardFilter,
  onCardFilterChange,
  orderMode,
  onOrderModeChange,
  startSide,
  onStartSideChange,
  needsReviewCount,
  totalCards,
  onSubmit,
  onCloseSetup,
  onBackToGuide,
}) => {
  return (
    <Modal show={show} onHide={onCloseSetup} centered>
      <Modal.Header closeButton>
        <Modal.Title>Start Study Session</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {setupError && (
            <Alert variant="warning" className="mb-3">
              {setupError}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Which cards would you like to study?</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="filter-needs-review"
                name="cardFilter"
                label={`Only cards that need review (${needsReviewCount})`}
                value="needs_review"
                checked={cardFilter === "needs_review"}
                onChange={(e) => onCardFilterChange(e.target.value)}
                disabled={needsReviewCount === 0}
              />
              <Form.Check
                type="radio"
                id="filter-all"
                name="cardFilter"
                label={`All cards (${totalCards})`}
                value="all"
                checked={cardFilter === "all"}
                onChange={(e) => onCardFilterChange(e.target.value)}
                className="mt-1"
                disabled={totalCards === 0}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Order</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="order-original"
                name="orderMode"
                label="Original"
                value="original"
                checked={orderMode === "original"}
                onChange={(e) => onOrderModeChange(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="order-shuffle"
                name="orderMode"
                label="Shuffled"
                value="shuffle"
                checked={orderMode === "shuffle"}
                onChange={(e) => onOrderModeChange(e.target.value)}
                className="mt-1"
              />
              <Form.Check
                type="radio"
                id="order-reverse"
                name="orderMode"
                label="Reverse"
                value="reverse"
                checked={orderMode === "reverse"}
                onChange={(e) => onOrderModeChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Start side</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="start-front"
                name="startSide"
                label="Front first"
                value="front"
                checked={startSide === "front"}
                onChange={(e) => onStartSideChange(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="start-back"
                name="startSide"
                label="Back first"
                value="back"
                checked={startSide === "back"}
                onChange={(e) => onStartSideChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onBackToGuide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={totalCards === 0}>
            Start session
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SessionSetupModal;
