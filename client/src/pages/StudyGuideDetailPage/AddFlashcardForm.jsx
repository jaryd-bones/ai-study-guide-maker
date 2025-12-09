import { Row, Col, Card, Form, Button } from "react-bootstrap";

const AddFlashcardForm = ({
  showAddCardForm,
  frontText,
  backText,
  isCreating,
  onFrontTextChange,
  onBackTextChange,
  onSubmit,
  onCancel,
}) => {
  if (!showAddCardForm) return null;

  return (
    <Row className="d-flex justify-content-center">
      <Col lg={8}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h5">Add Flashcard</Card.Title>

            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Front</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={frontText}
                  onChange={onFrontTextChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Back</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={backText}
                  onChange={onBackTextChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isCreating}>
                  {isCreating ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddFlashcardForm;
