import { Modal, Button } from "react-bootstrap";
import { ArrowLeft, ArrowRepeat } from "react-bootstrap-icons";

const SessionCompletionModal = ({
  show,
  guideTitle,
  cardsStudied,
  onBackToGuide,
  onStudyAgain,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Session complete!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You have completed your study session for{" "}
          <strong>{guideTitle}</strong>.
        </p>
        <p className="mb-3">
          You studied {cardsStudied} cards this session.
        </p>

        <div className="mt-3 d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            onClick={onBackToGuide}
            className="d-flex gap-2 align-items-center"
          >
            <ArrowLeft size={15} />
            Back to study guide
          </Button>
          <Button
            variant="primary"
            onClick={onStudyAgain}
            className="d-flex gap-2 align-items-center"
          >
            <ArrowRepeat size={20} />
            Study again
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SessionCompletionModal;
