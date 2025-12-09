import { useEffect, useRef, useState } from "react";
import { Card, Button } from "react-bootstrap";
import MemorizationToggle from "../../components/common/MemorizationToggle/MemorizationToggle.jsx";
import styles from "./StudySessionPage.module.css";

const StudyFlashcard = ({
  card,
  isFlipped,
  onToggleFlip,
  startSide,
  isMemorized,
  onToggleStatus,
  onReviewAgainThisSession: onRevistLater,
  isUpdatingStatus,
  disableReviewAgain,
}) => {
  const frontText = card.frontText || "";
  const backText = card.backText || "";

  const frontScrollRef = useRef(null);
  const backScrollRef = useRef(null);

  const [isFrontScrollable, setIsFrontScrollable] = useState(false);
  const [isBackScrollable, setIsBackScrollable] = useState(false);

  useEffect(() => {
    if (frontScrollRef.current) {
      const { scrollHeight, clientHeight } = frontScrollRef.current;
      setIsFrontScrollable(scrollHeight > clientHeight + 1);
    }

    if (backScrollRef.current) {
      const { scrollHeight, clientHeight } = backScrollRef.current;
      setIsBackScrollable(scrollHeight > clientHeight + 1);
    }
  }, [frontText, backText, startSide]);

  // Which side is currently visible for scrolling
  const activeScrollRef = isFlipped ? backScrollRef : frontScrollRef;

  // Pipe wheel events into active scroll area so user can scroll card with mouse wheel
  const handleWheel = (e) => {
    const target = activeScrollRef.current;
    if (!target) return;

    // If card text doesnt overflow, allow normal scroll behavior
    if (target.scrollHeight <= target.clientHeight) {
      return;
    }

    e.preventDefault();
    target.scrollTop += e.deltaY;
  };

  // Keep button and toggle clicks from flipping card
  const handleRevisitLater = (e) => {
    e.stopPropagation();
    if (onRevistLater) {
      onRevistLater();
    }
  };

  const handleToggleClickWrapper = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.studyFlashcardContainer}
      onClick={onToggleFlip}
      onWheel={handleWheel}
    >
      <div
        className={`${styles.studyFlashcardInner} ${
          isFlipped ? styles.studyFlashcardInnerIsFlipped : ""
        }`.trim()}
      >
        {/* Starting side (not just the front), is bold */}
        <div className={styles.studyFlashcardFace}>
          <Card className="w-100">
            <Card.Body
              className={`${styles.studyFlashcardCardBody} d-flex flex-column`}
            >
              <div
                ref={frontScrollRef}
                className={`${styles.studyFlashcardScrollArea} d-flex flex-column flex-grow-1 ${
                  isFrontScrollable
                    ? `${styles.studyFlashcardScrollAreaScrollable} justify-content-start`
                    : `${styles.studyFlashcardScrollAreaCentered} justify-content-center`
                }`}
              >
                <p
                  className={`${styles.studyFlashcardText} fw-semibold fs-5 mb-3`}
                >
                  {startSide === "front" ? frontText : backText}
                </p>
              </div>

              {/* Card controls */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 w-100">
                <div onClick={handleToggleClickWrapper} className="flex-grow-1">
                  <MemorizationToggle
                    isMemorized={isMemorized}
                    onToggle={onToggleStatus}
                    disabled={isUpdatingStatus}
                    leftLabelClassName="session-toggle-label-wide-left"
                    rightLabelClassName="session-toggle-label-wide-right"
                  />
                </div>

                {/* Disabled for last card in session because it is impossible to send to the back */}
                {!disableReviewAgain && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onClick={handleRevisitLater}
                    className="ms-auto"
                  >
                    Revisit Later
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Flipped side */}
        <div
          className={`${styles.studyFlashcardFace} ${styles.studyFlashcardFaceBack}`}
        >
          <Card className="w-100">
            <Card.Body
              className={`${styles.studyFlashcardCardBody} d-flex flex-column`}
            >
              <div
                ref={backScrollRef}
                className={`${styles.studyFlashcardScrollArea} d-flex flex-column flex-grow-1 ${
                  isBackScrollable
                    ? `${styles.studyFlashcardScrollAreaScrollable} justify-content-start`
                    : `${styles.studyFlashcardScrollAreaCentered} justify-content-center`
                }`}
              >
                <p className={`${styles.studyFlashcardText} mb-3`}>
                  {startSide === "front" ? backText : frontText}
                </p>
              </div>

              {/* Controls */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 w-100">
                <div onClick={handleToggleClickWrapper} className="flex-grow-1">
                  <MemorizationToggle
                    isMemorized={isMemorized}
                    onToggle={onToggleStatus}
                    disabled={isUpdatingStatus}
                    leftLabelClassName="session-toggle-label-wide-left"
                    rightLabelClassName="session-toggle-label-wide-right"
                  />
                </div>

                {!disableReviewAgain && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onClick={handleRevisitLater}
                    className="ms-auto"
                  >
                    Revisit Later
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyFlashcard;
