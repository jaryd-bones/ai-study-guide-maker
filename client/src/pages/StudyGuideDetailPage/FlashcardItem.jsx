import { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import MemorizationToggle from "../../components/common/MemorizationToggle/MemorizationToggle";
import styles from "./StudyGuideDetailPage.module.css";

const FlashcardItem = ({
  card,
  isUpdating,
  onToggleStatus,
  onSave,
  onDelete,
}) => {
  const [frontText, setFrontText] = useState(card.frontText || "");
  const [backText, setBackText] = useState(card.backText || "");

  const isMemorized = card.status === "memorized";

  useEffect(() => {
    setFrontText(card.frontText || "");
    setBackText(card.backText || "");
  }, [card.frontText, card.backText]);

  const handleEditToggle = () => {
    if (isEditing) {
      setFrontText(card.frontText || "");
      setBackText(card.backText || "");
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveClick = async () => {
    const trimmedFront = frontText.trim();
    const trimmedBack = backText.trim();
    if (!trimmedFront || !trimmedBack) return;

    await onSave(card.id, trimmedFront, trimmedBack);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (!onDelete) return;
    onDelete();
  };

  return (
    <Card className={`mb-3 ${styles.flashcardItemCard}`}>
      <Card.Body className={styles.flashcardItemCardBody}>
        <div
          className={`d-flex justify-content-between align-items-center mb-3 ${styles.flashcardItemHeaderRow}`}
        >
          <MemorizationToggle
            isMemorized={isMemorized}
            onToggle={onToggleStatus}
            disabled={isUpdating}
          />
          <div
            className={`d-flex align-items-center gap-2 ${styles.flashcardItemActions}`}
          >
            <Button
              size="sm"
              variant="outline-secondary"
              disabled={isUpdating}
              onClick={handleEditToggle}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              disabled={isUpdating}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Front</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Back</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
              />
            </Form.Group>

            <div
              className={`d-flex justify-content-end ${styles.flashcardItemFormActions}`}
            >
              <Button
                size="sm"
                variant="primary"
                disabled={isUpdating}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Card.Subtitle
              className={`fw-semibold mb-1 fs-5 mb-3 ${styles.flashcardItemFrontText}`}
            >
              {card.frontText}
            </Card.Subtitle>
            <Card.Text
              className={`text-muted mb-2 ${styles.flashcardItemBackText}`}
            >
              {card.backText}
            </Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FlashcardItem;
