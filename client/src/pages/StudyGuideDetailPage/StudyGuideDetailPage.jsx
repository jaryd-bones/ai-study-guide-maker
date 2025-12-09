import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

import {
  fetchStudyGuideById,
  fetchFlashcardsForGuide,
  createFlashcard,
  updateFlashcard,
  deleteStudyGuide,
  deleteFlashcard,
  updateStudyGuide,
} from "../../services/studyGuidesApi.js";

import FlashcardItem from "./FlashcardItem.jsx";
import StudyGuideHeaderSection from "./StudyGuideHeaderSection.jsx";
import StudyGuideActionsRow from "./StudyGuideActionsRow.jsx";
import AddFlashcardForm from "./AddFlashcardForm.jsx";
import FlashcardFilterBar from "./FlashcardFilterBar.jsx";
import DeleteStudyGuideModal from "./DeleteStudyGuideModal.jsx";
import DeleteFlashcardModal from "./DeleteFlashcardModal.jsx";

{/* Appears when user saves a new flashcard */}
const FlashcardCreatedToast = ({ show, onClose }) => (
  <ToastContainer position="bottom-end" className="p-3">
    <Toast
      bg="success"
      onClose={onClose}
      show={show}
      delay={2000}
      autohide
    >
      <Toast.Body className="text-white">New flashcard added</Toast.Body>
    </Toast>
  </ToastContainer>
);

const StudyGuideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [filter, setFilter] = useState("all");
  const [updatingCardId, setUpdatingCardId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showCreateToast, setShowCreateToast] = useState(false);

  // State for delete confirmation modals
  const [showDeleteGuideModal, setShowDeleteGuideModal] = useState(false);
  const [showDeleteFlashcardModal, setShowDeleteFlashcardModal] =
    useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);

  // Refs for contentEditable elements
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [guideData, flashcardData] = await Promise.all([
          fetchStudyGuideById(id),
          fetchFlashcardsForGuide(id),
        ]);

        setGuide(guideData);
        setFlashcards(flashcardData || []);
      } catch (err) {
        setError("Could not load study guide.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  // Sync edit state when guide changes or editing ends
  useEffect(() => {
    if (guide) {
      const safeTitle = guide.title || "";
      const safeDescription = guide.description || "";

      setEditTitle(safeTitle);
      setEditDescription(safeDescription);

      if (!isEditing) {
        if (titleRef.current) titleRef.current.textContent = safeTitle;
        if (descriptionRef.current) {
          descriptionRef.current.textContent = safeDescription;
        }
      }
    }
  }, [guide, isEditing]);

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    if (!frontText.trim() || !backText.trim()) return;

    try {
      setIsCreating(true);

      const created = await createFlashcard(id, {
        frontText: frontText.trim(),
        backText: backText.trim(),
      });

      setFlashcards((prev) => [...prev, created]);
      setFrontText("");
      setBackText("");
      setShowCreateToast(true);
    } catch {
      setError("Could not create flashcard.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCard = async (cardId, newFront, newBack) => {
    try {
      setUpdatingCardId(cardId);
      const updated = await updateFlashcard(cardId, {
        frontText: newFront.trim(),
        backText: newBack.trim(),
      });

      setFlashcards((prev) =>
        prev.map((c) => (c.id === cardId ? updated : c))
      );
    } catch {
      setError("Could not update flashcard.");
    } finally {
      setUpdatingCardId(null);
    }
  };

  const toggleStatus = async (card) => {
    const newStatus =
      card.status === "memorized" ? "needs_review" : "memorized";

    try {
      setUpdatingCardId(card.id);

      const updated = await updateFlashcard(card.id, { status: newStatus });

      setFlashcards((prev) =>
        prev.map((c) => (c.id === card.id ? updated : c))
      );
    } catch {
      setError("Could not update flashcard status.");
    } finally {
      setUpdatingCardId(null);
    }
  };

  // Delete Study Guide
  const handleOpenDeleteStudyGuideModal = () => {
    setShowDeleteGuideModal(true);
  };

  const handleCancelDeleteStudyGuide = () => {
    setShowDeleteGuideModal(false);
  };

  const handleConfirmDeleteStudyGuide = async () => {
    try {
      setShowDeleteGuideModal(false);
      setIsLoading(true);
      await deleteStudyGuide(id);
      navigate("/dashboard");
    } catch {
      setIsLoading(false);
      setError("Could not delete study guide.");
    }
  };

  // Delete Flashcard
  const handleOpenDeleteFlashcardModal = (cardId) => {
    setFlashcardToDelete(cardId);
    setShowDeleteFlashcardModal(true);
  };

  const handleCancelDeleteFlashcard = () => {
    setShowDeleteFlashcardModal(false);
    setFlashcardToDelete(null);
  };

  const handleConfirmDeleteFlashcard = async () => {
    if (!flashcardToDelete) return;

    try {
      setUpdatingCardId(flashcardToDelete);
      await deleteFlashcard(flashcardToDelete);
      setFlashcards((prev) =>
        prev.filter((c) => c.id !== flashcardToDelete)
      );
    } catch {
      setError("Could not delete flashcard.");
    } finally {
      setUpdatingCardId(null);
      setShowDeleteFlashcardModal(false);
      setFlashcardToDelete(null);
    }
  };

  const visibleFlashcards = useMemo(
    () =>
      flashcards.filter((c) => {
        if (filter === "needs_review") return c.status === "needs_review";
        if (filter === "memorized") return c.status === "memorized";
        return true;
      }),
    [flashcards, filter]
  );

  const handleStartEdit = () => {
    setIsEditing(true);

    if (titleRef.current) titleRef.current.textContent = editTitle;
    if (descriptionRef.current) {
      descriptionRef.current.textContent = editDescription;
    }
  };

  const handleCancelEdit = () => {
    if (guide) {
      const safeTitle = guide.title || "";
      const safeDescription = guide.description || "";

      setEditTitle(safeTitle);
      setEditDescription(safeDescription);

      if (titleRef.current) titleRef.current.textContent = safeTitle;
      if (descriptionRef.current) {
        descriptionRef.current.textContent = safeDescription;
      }
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!guide) return;

    const trimmedTitle = editTitle.trim();
    const trimmedDescription = editDescription.trim();

    const payload = {
      title: trimmedTitle || guide.title || "",
      description: trimmedDescription,
    };

    try {
      const updated = await updateStudyGuide(id, payload);
      setGuide(updated);
      setIsEditing(false);
    } catch {
      setError("Could not update study guide.");
    }
  };

  if (isLoading) {
    return (
      <Container
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-3">Loading…</div>
        </div>
      </Container>
    );
  }

  if (!guide) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Study guide not found.</Alert>
        <Button as={Link} to="/dashboard" variant="secondary">
          <span className="d-inline-flex align-items-center gap-2">
            <ArrowLeft size={15} />
            Back to dashboard
          </span>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <Button
            as={Link}
            to="/dashboard"
            variant="secondary"
            className="d-inline-flex align-items-center gap-2"
          >
            <span className="d-inline-flex align-items-center gap-2">
              <ArrowLeft size={15} />
              Back
            </span>
          </Button>
        </Col>
      </Row>

      {/* Editable Title and Description */}
      <StudyGuideHeaderSection
        guide={guide}
        isEditing={isEditing}
        titleRef={titleRef}
        descriptionRef={descriptionRef}
        onEditTitleChange={setEditTitle}
        onEditDescriptionChange={setEditDescription}
      />

      {/* Actions */}
      <StudyGuideActionsRow
        guideId={id}
        isEditing={isEditing}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onToggleAddCardForm={() =>
          setShowAddCardForm((prevShow) => !prevShow)
        }
        onOpenDeleteStudyGuideModal={handleOpenDeleteStudyGuideModal}
      />

      {/* Error */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <AddFlashcardForm
        showAddCardForm={showAddCardForm}
        frontText={frontText}
        backText={backText}
        isCreating={isCreating}
        onFrontTextChange={(e) => setFrontText(e.target.value)}
        onBackTextChange={(e) => setBackText(e.target.value)}
        onSubmit={handleCreateFlashcard}
        onCancel={() => setShowAddCardForm(false)}
      />

      {/* Filter */}
      <FlashcardFilterBar filter={filter} onFilterChange={setFilter} />

      {/* Flashcards */}
      {visibleFlashcards.length === 0 ? (
        <Card>
          <Card.Body>No flashcards found.</Card.Body>
        </Card>
      ) : (
        visibleFlashcards.map((card) => (
          <FlashcardItem
            key={card.id}
            card={card}
            isUpdating={updatingCardId === card.id}
            onToggleStatus={() => toggleStatus(card)}
            onSave={handleUpdateCard}
            onDelete={() => handleOpenDeleteFlashcardModal(card.id)}
          />
        ))
      )}

      {/* Delete Study Guide Modal */}
      <DeleteStudyGuideModal
        show={showDeleteGuideModal}
        onCancel={handleCancelDeleteStudyGuide}
        onConfirm={handleConfirmDeleteStudyGuide}
      />

      {/* Delete Flashcard Modal */}
      <DeleteFlashcardModal
        show={showDeleteFlashcardModal}
        onCancel={handleCancelDeleteFlashcard}
        onConfirm={handleConfirmDeleteFlashcard}
      />

      {/* Flashcard created toast */}
      <FlashcardCreatedToast
        show={showCreateToast}
        onClose={() => setShowCreateToast(false)}
      />
    </Container>
  );
};

export default StudyGuideDetailPage;
