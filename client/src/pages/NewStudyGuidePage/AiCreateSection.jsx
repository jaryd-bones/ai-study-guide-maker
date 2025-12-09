import { Form, Button, Spinner } from "react-bootstrap";
import ToggleSwitch from "../../components/common/ToggleSwitch/ToggleSwitch.jsx";
import styles from "./NewStudyGuidePage.module.css";

const AiCreateSection = ({
  isVisible,
  aiInputMode,
  isSubmitting,
  aiText,
  uploadFileName,
  isAiTextDisabled,
  isAiFileDisabled,
  onAiInputModeToggle,
  onAiTextChange,
  onFileChange,
  onGenerateWithAiFromText,
  onGenerateWithAiFromUpload,
}) => {
  const outerSectionClassName = `${styles.modeSection} ${
    isVisible ? styles.modeSectionVisible : styles.modeSectionHidden
  }`;

  const textSectionClassName = `${styles.modeSection} ${
    aiInputMode === "text"
      ? styles.modeSectionVisible
      : styles.modeSectionHidden
  }`;

  const fileSectionClassName = `${styles.modeSection} ${
    aiInputMode === "file"
      ? styles.modeSectionVisible
      : styles.modeSectionHidden
  }`;

  const handleGenerateClick = () => {
    if (aiInputMode === "text") {
      onGenerateWithAiFromText();
    } else {
      onGenerateWithAiFromUpload();
    }
  };

  const isGenerateDisabled =
    aiInputMode === "text" ? isAiTextDisabled : isAiFileDisabled;

  return (
    <div className={outerSectionClassName}>
      {/* Toggle between text and file upload */}
      <Form.Group className="mb-2" controlId="ai-input-type">
        <Form.Label className="mb-1">Input type</Form.Label>

        <ToggleSwitch
          isOn={aiInputMode === "file"}
          onToggle={onAiInputModeToggle}
          disabled={isSubmitting}
          leftLabel="Text"
          rightLabel="File"
          leftLabelClassName={styles.uploadTypeToggleLabelWideLeft}
          rightLabelClassName={styles.uploadTypeToggleLabelWideRight}
          leftColor="#3b82f6"
          rightColor="#3b82f6"
        />
      </Form.Group>

      <Form.Text className="text-muted d-block mb-3">
        Title and description above are optional in AI mode – if you leave them
        blank, AI will generate them for you.
      </Form.Text>

      <div className={textSectionClassName}>
        <Form.Group className="mb-3" controlId="ai-notes">
          <Form.Label>Paste your notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Paste lecture notes, textbook excerpts, or copied slides here..."
            value={aiText}
            onChange={onAiTextChange}
          />
        </Form.Group>
      </div>

      <div className={fileSectionClassName}>
        <Form.Group className="mb-3" controlId="file-upload">
          <Form.Label>Upload a file (PDF or image)</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,image/*"
            onChange={onFileChange}
          />
          {uploadFileName && (
            <Form.Text className="text-muted">
              Selected: {uploadFileName}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      <div className="d-grid">
        <Button
          variant="primary"
          type="button"
          onClick={handleGenerateClick}
          disabled={isSubmitting || isGenerateDisabled}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Generating...
            </>
          ) : (
            <>Generate</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AiCreateSection;
