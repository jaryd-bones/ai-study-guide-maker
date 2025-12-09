import { Button, Spinner } from "react-bootstrap";
import styles from "./NewStudyGuidePage.module.css";

const ManualCreateSection = ({ isVisible, isSubmitting, isDisabled }) => {
  const sectionClassName = `${styles.modeSection} ${
    isVisible ? styles.modeSectionVisible : styles.modeSectionHidden
  }`;

  return (
    <div className={sectionClassName}>
      <div className="d-grid">
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creating...
            </>
          ) : (
            "Create Study Guide"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ManualCreateSection;
