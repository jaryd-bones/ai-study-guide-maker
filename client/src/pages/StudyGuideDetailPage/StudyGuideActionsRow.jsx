import { Row, Col, Button } from "react-bootstrap";
import {
  PlayFill,
  PlusLg,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const StudyGuideActionsRow = ({
  guideId,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleAddCardForm,
  onOpenDeleteStudyGuideModal,
}) => {
  return (
    <Row className="mb-3">
      <Col>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <Button
              as={Link}
              to={`/study-guides/${guideId}/study`}
              variant="primary"
              className="d-flex gap-1 align-items-center fs-6"
            >
              <PlayFill size={20} />
              Study
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button
              type="button"
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={onToggleAddCardForm}
            >
              <PlusLg size={15} />
              Add Flashcards
            </Button>

            {!isEditing ? (
              <Button
                variant="secondary"
                onClick={onStartEdit}
                className="d-flex align-items-center gap-2"
              >
                <PencilSquare />
                Edit
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={onSaveEdit}>
                  Save
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="danger"
              className="d-flex align-items-center gap-1"
              onClick={onOpenDeleteStudyGuideModal}
            >
              <Trash size={16} />
              Delete
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default StudyGuideActionsRow;
