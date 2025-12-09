import { Row, Col, Button } from "react-bootstrap";
import {
  ArrowLeftShort,
  ArrowRightShort,
  GearFill,
} from "react-bootstrap-icons";

const StudySessionControls = ({
  sessionLength,
  currentIndex,
  hasCurrentCard,
  isNavigating,
  onPrev,
  onNext,
  onOpenSetup,
}) => {
  return (
    <Row className="justify-content-center mt-3">
      <Col xs={12} md={8} lg={6}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex flex-column flex-grow-1">
            <div className="mb-1">
              {sessionLength > 0 && hasCurrentCard && (
                <span>
                  Card {currentIndex + 1} of {sessionLength}
                </span>
              )}
            </div>

            {/* Change card controls */}
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={onPrev}
                disabled={!hasCurrentCard || currentIndex === 0 || isNavigating}
                title="Prev Card"
              >
                <ArrowLeftShort size={25} />
              </Button>
              <Button
                variant="secondary"
                onClick={onNext}
                disabled={!hasCurrentCard || isNavigating}
                title="Next Card"
              >
                <ArrowRightShort size={25} />
              </Button>
            </div>
          </div>

          {/* Session Settings */}
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              size="sm"
              onClick={onOpenSetup}
              title="Session Settings"
            >
              <GearFill size={20} />
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default StudySessionControls;
