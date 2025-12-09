import { Modal, Button } from "react-bootstrap";

const DeleteStudyGuideModal = ({ show, onCancel, onConfirm }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete study guide?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          Are you sure you want to delete this study guide? This will also
          delete all of its flashcards.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteStudyGuideModal;
