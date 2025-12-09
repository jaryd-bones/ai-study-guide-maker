import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";

import {
  fetchStudyGuideById,
  fetchFlashcardsForGuide,
  updateFlashcard,
} from "../../services/studyGuidesApi.js";
import styles from "./StudySessionPage.module.css";

import ConfettiOverlay from "./ConfettiOverlay.jsx";
import StudyFlashcard from "./StudyFlashcard.jsx";
import SessionSetupModal from "./SessionSetupModal.jsx";
import SessionCompletionModal from "./SessionCompletionModal.jsx";
import StudySessionHeader from "./StudySessionHeader.jsx";
import StudySessionControls from "./StudySessionControls.jsx";

const StudySessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Session setup modal state
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [setupError, setSetupError] = useState("");

  // Session options state
  const [cardFilter, setCardFilter] = useState("needs_review");  // "all" or "needs_review"
  const [orderMode, setOrderMode] = useState("original");  // "original" | "shuffle" | "reverse"
  const [startSide, setStartSide] = useState("front");  // "front" or "back"

  // Active study session state
  const [sessionQueue, setSessionQueue] = useState([]);  // Queue of flashcard objects
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Card animation state
  const [cardTransition, setCardTransition] = useState("");
  const [pendingIndex, setPendingIndex] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingReviewAgain, setPendingReviewAgain] = useState(false);

  // Completion effects state
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const [guideData, flashcardData] = await Promise.all([
          fetchStudyGuideById(id),
          fetchFlashcardsForGuide(id),
        ]);
        setGuide(guideData);
        setFlashcards(flashcardData || []);
      } catch (err) {
        console.error("Error loading study session data:", err);
        setLoadError("There was a problem loading this study guide.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const memorizedCount = useMemo(
    () => flashcards.filter((c) => c.status === "memorized").length,
    [flashcards]
  );
  const needsReviewCount = useMemo(
    () => flashcards.filter((c) => c.status === "needs_review").length,
    [flashcards]
  );

  const totalCards = flashcards.length;

  const currentCard =
    sessionQueue.length > 0 &&
    currentIndex >= 0 &&
    currentIndex < sessionQueue.length
      ? sessionQueue[currentIndex]
      : null;

  const isLastCard =
    sessionQueue.length > 0 && currentIndex === sessionQueue.length - 1;

  const disableReviewAgain = sessionQueue.length <= 1 || isLastCard;

  const shuffleArray = (arr) => {
    const copied = [...arr];
    for (let i = copied.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  };

  const handleOpenSetup = () => {
    setShowSetupModal(true);
  };

  const handleCloseSetup = () => {
    setShowSetupModal(false);
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    setSetupError("");

    // Reset states for new session
    setCardTransition("");
    setPendingIndex(null);
    setIsNavigating(false);
    setPendingReviewAgain(false);

    let cardsToStudy = [...flashcards];

    if (cardFilter === "needs_review") {
      cardsToStudy = cardsToStudy.filter(
        (c) => c.status === "needs_review"
      );
    }

    if (cardsToStudy.length === 0) {
      setSetupError(
        cardFilter === "needs_review"
          ? "You have no cards that need review. Try studying all cards instead."
          : "There are no cards in this study guide yet."
      );
      return;
    }

    if (orderMode === "shuffle") {
      cardsToStudy = shuffleArray(cardsToStudy);
    } else if (orderMode === "reverse") {
      cardsToStudy = [...cardsToStudy].reverse();
    }

    setSessionQueue(cardsToStudy);
    setCurrentIndex(0);

    setIsFlipped(false); // Start card as unflipped
    setShowCompletionModal(false);
    setCardTransition("slideInNext");
    setShowSetupModal(false);
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleSessionCompletion = () => {
    setShowConfetti(true);
    setShowCompletionModal(true);

    // Stop confetti
    window.setTimeout(() => {
      setShowConfetti(false);
    }, 2600);
  };

  // Start slide animation before changing index
  const startCardNavigation = (direction) => {
    if (!currentCard || isNavigating) return;

    const isNext = direction === "next";
    const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;

    // Handle bounds and completion
    if (isNext && currentIndex === sessionQueue.length - 1) {
      handleSessionCompletion();
      return;
    }

    if (targetIndex < 0 || targetIndex >= sessionQueue.length) {
      return;
    }

    setPendingReviewAgain(false);

    setIsNavigating(true);
    setPendingIndex(targetIndex);
    setCardTransition(isNext ? "slideOutNext" : "slideOutPrev");
  };

  const goToNextCard = () => {
    if (!currentCard) return;
    startCardNavigation("next");
  };

  const goToPrevCard = () => {
    if (!currentCard) return;
    if (currentIndex === 0) return;
    startCardNavigation("prev");
  };

  // Flow: slide out -> change index and modify queue -> slide in
  const handleCardAnimationEnd = () => {
    if (!cardTransition) return;

    if (cardTransition === "slideOutNext" || cardTransition === "slideOutPrev") {
      const goingNext = cardTransition === "slideOutNext";

      if (goingNext && pendingReviewAgain) {
        setSessionQueue((prevQueue) => {
          const current = prevQueue[currentIndex];
          const withoutCurrent = prevQueue.filter(
            (_, idx) => idx !== currentIndex
          );
          return [...withoutCurrent, current];
        });

        setPendingReviewAgain(false);
        setPendingIndex(null);
        setIsFlipped(false);
        setCardTransition("slideInNext");
        return;
      }

      if (pendingIndex !== null) {
        setCurrentIndex(pendingIndex);
      }
      setPendingIndex(null);
      setIsFlipped(false);

      setCardTransition(goingNext ? "slideInNext" : "slideInPrev");
      return;
    }

    if (cardTransition === "slideInNext" || cardTransition === "slideInPrev") {
      setCardTransition("");
      setIsNavigating(false);
    }
  };

  // Move current card to back and advance to next card
  const handleReviewAgainThisSession = () => {
    if (!currentCard || sessionQueue.length <= 1) return;

    const lastIndex = sessionQueue.length - 1;
    if (currentIndex === lastIndex) {
      return;
    }

    if (isNavigating) return;

    setPendingReviewAgain(true);
    setIsNavigating(true);
    setCardTransition("slideOutNext");
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!currentCard) return;
    setIsUpdatingStatus(true);
    setUpdateError("");

    try {
      const updated = await updateFlashcard(currentCard.id, { status: newStatus });

      setFlashcards((prev) =>
        prev.map((c) =>
          c.id === updated.id ? { ...c, status: updated.status } : c
        )
      );

      setSessionQueue((prev) =>
        prev.map((c) =>
          c.id === updated.id ? { ...c, status: updated.status } : c
        )
      );
    } catch (err) {
      console.error("Error updating flashcard status:", err);
      setUpdateError("Could not update card status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleCurrentCardStatus = () => {
    if (!currentCard) return;
    const newStatus =
      currentCard.status === "memorized" ? "needs_review" : "memorized";
    handleUpdateStatus(newStatus);
  };

  const handleBackToGuide = () => {
    navigate(`/study-guides/${id}`);
  };

  const handleStudyAgain = () => {
    setShowCompletionModal(false);
    setShowSetupModal(true);
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" role="status" />
            <div className="mt-3">Loading study session…</div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger" className="mb-3">
              {loadError}
            </Alert>
            <Button variant="secondary" as={Link} to="/dashboard">
              <span className="d-inline-flex align-items-center gap-1">
                <ArrowLeft size={15} />
                <span>Back to dashboard</span>
              </span>
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!guide) {
    return null;
  }

  const overallMemorizedPercent =
    totalCards > 0 ? Math.round((memorizedCount / totalCards) * 100) : 0;

  return (
    <>
      <ConfettiOverlay active={showConfetti} />

      <SessionCompletionModal
        show={showCompletionModal}
        guideTitle={guide.title}
        cardsStudied={sessionQueue.length}
        onBackToGuide={handleBackToGuide}
        onStudyAgain={handleStudyAgain}
        onHide={() => setShowCompletionModal(false)}
      />

      <SessionSetupModal
        show={showSetupModal}
        setupError={setupError}
        cardFilter={cardFilter}
        onCardFilterChange={setCardFilter}
        orderMode={orderMode}
        onOrderModeChange={setOrderMode}
        startSide={startSide}
        onStartSideChange={setStartSide}
        needsReviewCount={needsReviewCount}
        totalCards={totalCards}
        onSubmit={handleStartSession}
        onCloseSetup={handleCloseSetup}
        onBackToGuide={handleBackToGuide}
      />

      <Container className="py-4">
        <StudySessionHeader
          guideTitle={guide.title}
          memorizedCount={memorizedCount}
          totalCards={totalCards}
          overallMemorizedPercent={overallMemorizedPercent}
          onBackToGuide={handleBackToGuide}
        />

        {updateError && (
          <Row className="mb-3">
            <Col md={8}>
              <Alert
                variant="danger"
                onClose={() => setUpdateError("")}
                dismissible
              >
                {updateError}
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="justify-content-center pt-3">
          <Col xs={12} md={9} lg={7} xl={6} className="mb-3">
            {currentCard ? (
              <div
                className={`${styles.studyFlashcardAnimWrapper} ${
                  cardTransition ? styles[cardTransition] : ""
                }`.trim()}
                onAnimationEnd={handleCardAnimationEnd}
              >
                <StudyFlashcard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onToggleFlip={handleFlipCard}
                  startSide={startSide}
                  isMemorized={currentCard?.status === "memorized"}
                  onToggleStatus={handleToggleCurrentCardStatus}
                  onReviewAgainThisSession={handleReviewAgainThisSession}
                  isUpdatingStatus={isUpdatingStatus}
                  disableReviewAgain={disableReviewAgain}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="mb-2">
                  {totalCards === 0
                    ? "This study guide doesn't have any flashcards yet."
                    : "No cards in this session. Try adjusting your settings."}
                </p>
                <Button variant="primary" onClick={handleOpenSetup}>
                  <span className="d-inline-flex align-items-center gap-2">
                    <GearFill size={20} />
                    <span>Session settings</span>
                  </span>
                </Button>
              </div>
            )}
          </Col>
        </Row>

        <StudySessionControls
          sessionLength={sessionQueue.length}
          currentIndex={currentIndex}
          hasCurrentCard={!!currentCard}
          isNavigating={isNavigating}
          onPrev={goToPrevCard}
          onNext={goToNextCard}
          onOpenSetup={handleOpenSetup}
        />
      </Container>
    </>
  );
};

export default StudySessionPage;
