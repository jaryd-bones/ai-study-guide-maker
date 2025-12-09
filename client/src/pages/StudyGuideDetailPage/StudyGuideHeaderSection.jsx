import { Row, Col, Form } from "react-bootstrap";
import styles from "./StudyGuideDetailPage.module.css";

const StudyGuideHeaderSection = ({
  guide,
  isEditing,
  titleRef,
  descriptionRef,
  onEditTitleChange,
  onEditDescriptionChange,
}) => {
  const hasDescription =
    !!guide.description && guide.description.trim() !== "";
  const showDescriptionBlock = isEditing || hasDescription;

  const handleTitleInput = (e) => {
    if (!isEditing) return;
    onEditTitleChange(e.currentTarget.textContent || "");
  };

  const handleDescriptionInput = (e) => {
    if (!isEditing) return;
    onEditDescriptionChange(e.currentTarget.textContent || "");
  };

  return (
    <>
      <Row className="mb-0">
        <Col>
          {isEditing && <Form.Label className="mb-1">Title</Form.Label>}
          <h1
            ref={titleRef}
            className={`h3 ${styles.editableInline} ${
              isEditing ? styles.editableInlineActive : ""
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onInput={handleTitleInput}
          >
            {guide.title}
          </h1>
        </Col>
      </Row>

      <Row
        className={`mb-3 ${styles.editSection} ${
          showDescriptionBlock
            ? styles.editSectionVisible
            : styles.editSectionHidden
        }`}
      >
        <Col>
          {isEditing && (
            <Form.Label className="mb-1">Description</Form.Label>
          )}
          <p
            ref={descriptionRef}
            className={`${styles.studyGuideDetailDescription} ${styles.editableInline} ${
              isEditing ? styles.editableInlineActive : ""
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onInput={handleDescriptionInput}
          >
            {guide.description}
          </p>
        </Col>
      </Row>
    </>
  );
};

export default StudyGuideHeaderSection;
