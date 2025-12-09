import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createStudyGuide,
  createStudyGuideFromText,
  createStudyGuideFromUpload,
} from "../../services/studyGuidesApi.js";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Card,
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import ToggleSwitch from "../../components/common/ToggleSwitch/ToggleSwitch.jsx";

import StudyGuideMetaForm from "./StudyGuideMetaForm.jsx";
import ManualCreateSection from "./ManualCreateSection.jsx";
import AiCreateSection from "./AiCreateSection.jsx";

const NewStudyGuidePage = () => {
  const [mode, setMode] = useState("manual"); // "manual" or "ai"
  const [aiInputMode, setAiInputMode] = useState("text"); // "text" or "file"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiText, setAiText] = useState("");

  // State for AI create with file
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isAiMode = mode === "ai";

  // Manual create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode !== "manual") return;
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
      };

      const created = await createStudyGuide(payload);
      navigate(`/study-guides/${created.id}`);
    } catch (err) {
      console.error("Failed to create study guide:", err);
      setError("Could not create study guide. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI create with text
  const handleGenerateWithAiFromText = async () => {
    if (!aiText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        text: aiText,
        // If title and description are left blank, generate them with AI
        title: title.trim() || null,
        description: description.trim() || null,
      };

      const created = await createStudyGuideFromText(payload);
      navigate(`/study-guides/${created.id}`);
    } catch (err) {
      console.error("Failed to generate AI study guide from text:", err);
      setError("AI generation from text failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI create with file
  const handleGenerateWithAiFromUpload = async () => {
    if (!uploadFile) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();

      if (trimmedTitle) {
        formData.append("title", trimmedTitle);
      }
      if (trimmedDescription) {
        formData.append("description", trimmedDescription);
      }

      const created = await createStudyGuideFromUpload(formData);
      navigate(`/study-guides/${created.id}`);
    } catch (err) {
      console.error("Failed to generate AI study guide from file:", err);
      setError("AI generation from file failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setUploadFile(file || null);
    setUploadFileName(file ? file.name : "");
  };

  const handleModeToggle = () => {
    setMode((prev) => (prev === "manual" ? "ai" : "manual"));
    setError(null);
  };

  const handleAiInputModeToggle = () => {
    setAiInputMode((prev) => (prev === "text" ? "file" : "text"));
    setError(null);
  };

  const isAiTextDisabled = isSubmitting || !aiText.trim();
  const isAiFileDisabled = isSubmitting || !uploadFile;
  const isManualDisabled = !title.trim();

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/dashboard" variant="secondary">
            <span className="d-inline-flex align-items-center gap-2">
              <ArrowLeft size={15} />
              <span>Back</span>
            </span>
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h1" className="h3 mb-3 text-center">
                Create a New Study Guide
              </Card.Title>
              <Card.Text className="text-muted text-center mb-4">
                You can create a guide manually or have AI generate one from
                your notes.
              </Card.Text>

              {/* Toggle between AI and manual modes */}
              <div className="mb-3">
                <ToggleSwitch
                  isOn={mode === "ai"}
                  onToggle={handleModeToggle}
                  disabled={isSubmitting}
                  leftLabel="Manual"
                  rightLabel="AI"
                  align="center"
                  leftColor="#3b82f6"
                  rightColor="#3b82f6"
                />
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Shared inputs */}
                <StudyGuideMetaForm
                  title={title}
                  description={description}
                  onTitleChange={(e) => setTitle(e.target.value)}
                  onDescriptionChange={(e) => setDescription(e.target.value)}
                  isAiMode={isAiMode}
                />

                <ManualCreateSection
                  isVisible={mode === "manual"}
                  isSubmitting={isSubmitting}
                  isDisabled={isManualDisabled}
                />

                <AiCreateSection
                  isVisible={mode === "ai"}
                  aiInputMode={aiInputMode}
                  isSubmitting={isSubmitting}
                  aiText={aiText}
                  uploadFileName={uploadFileName}
                  isAiTextDisabled={isAiTextDisabled}
                  isAiFileDisabled={isAiFileDisabled}
                  onAiInputModeToggle={handleAiInputModeToggle}
                  onAiTextChange={(e) => setAiText(e.target.value)}
                  onFileChange={handleFileChange}
                  onGenerateWithAiFromText={handleGenerateWithAiFromText}
                  onGenerateWithAiFromUpload={handleGenerateWithAiFromUpload}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewStudyGuidePage;
