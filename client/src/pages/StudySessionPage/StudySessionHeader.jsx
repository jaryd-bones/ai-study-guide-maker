import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import styles from "./StudySessionPage.module.css";

const StudySessionHeader = ({
  guideTitle,
  memorizedCount,
  totalCards,
  overallMemorizedPercent,
  onBackToGuide,
}) => {
  return (
    <Row className="mb-4">
      <Col xs={12} md={8} className="d-flex flex-column justify-content-end">
        <Button
          variant="secondary"
          size="sm"
          className="mb-2 align-self-start"
          onClick={onBackToGuide}
        >
          <span className="d-inline-flex align-items-center gap-2">
            <ArrowLeft size={15} />
            Back
          </span>
        </Button>
        <h2 className="mb-0">{guideTitle}</h2>
      </Col>
      <Col
        xs={12}
        md={4}
        className="text-md-end mt-3 mt-md-0 d-flex flex-column justify-content-end"
      >
        <div className="mb-2">
          <strong>
            {memorizedCount} / {totalCards} cards memorized
          </strong>
        </div>
        <ProgressBar
          now={overallMemorizedPercent}
          className={styles.studyProgressBar}
          style={{ height: "0.8rem" }}
        />
      </Col>
    </Row>
  );
};

export default StudySessionHeader;
