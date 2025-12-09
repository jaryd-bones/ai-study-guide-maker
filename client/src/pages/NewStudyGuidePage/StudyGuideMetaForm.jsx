import { Form } from "react-bootstrap";

const StudyGuideMetaForm = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  isAiMode,
}) => {
  const isTitleRequired = !isAiMode;

  const titleLabel = isAiMode ? (
    <>Title (optional)</>
  ) : (
    <>
      Title <span className="text-danger">*</span>
    </>
  );

  const descriptionLabel = "Description (optional)";

  const titlePlaceholder = isAiMode
    ? "Add a title, or leave blank to let AI generate one"
    : "e.g. Biology Chapter 5 – Cell Structure";

  const descriptionPlaceholder = isAiMode
    ? "Add a description, or leave blank to let AI generate one"
    : "Short description of what this guide covers...";

  return (
    <>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>{titleLabel}</Form.Label>
        <Form.Control
          type="text"
          placeholder={titlePlaceholder}
          value={title}
          onChange={onTitleChange}
          required={isTitleRequired}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>{descriptionLabel}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={descriptionPlaceholder}
          value={description}
          onChange={onDescriptionChange}
        />
      </Form.Group>
    </>
  );
};

export default StudyGuideMetaForm;
