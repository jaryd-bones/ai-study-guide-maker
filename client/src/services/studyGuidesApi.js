import { apiClient } from "./apiClient.js";

// Study Guides
export const fetchStudyGuides = async () => {
  const response = await apiClient.get("/study-guides");
  return response.data;
};

export const createStudyGuide = async (payload) => {
  // Payload: { title, description }
  const response = await apiClient.post("/study-guides", {
    title: payload.title,
    description: payload.description,
  });
  return response.data;
};

export const fetchStudyGuideById = async (id) => {
  const response = await apiClient.get(`/study-guides/${id}`);
  return response.data;
};

export const updateStudyGuide = async (id, payload) => {
  // Payload: { title, description }
  const response = await apiClient.patch(`/study-guides/${id}`, payload);
  return response.data;
};

export const deleteStudyGuide = async (id) => {
  await apiClient.delete(`/study-guides/${id}`);
};

// Flashcards
export const fetchFlashcardsForGuide = async (id) => {
  const response = await apiClient.get(`/study-guides/${id}/flashcards`);
  return response.data;
};

export const createFlashcard = async (studyGuideId, payload) => {
  // Payload: { front_text, back_text }
  const response = await apiClient.post(
    `/study-guides/${studyGuideId}/flashcards`,
    payload
  );
  return response.data;
};

export const updateFlashcard = async (cardId, payload) => {
  // Payload: { front_text, back_text, status }
  const response = await apiClient.patch(
    `/study-guides/flashcards/${cardId}`,
    payload
  );
  return response.data;
};

export const deleteFlashcard = async (cardId) => {
  await apiClient.delete(`/study-guides/flashcards/${cardId}`);
};

// AI generation
export const createStudyGuideFromText = async (payload) => {
  // Payload: { text, title?, description? }
  // - If title/description are provided, they will be used as-is.
  // - If omitted/null/empty, AI will generate them.
  const response = await apiClient.post("/study-guides/ai/from-text", payload);
  return response.data; // returns { id, title, description, ... }
};

export const createStudyGuideFromUpload = async (formData) => {
  // FormData: "file" (required), "title" (optional), "description" (optional)
  const response = await apiClient.post(
    "/study-guides/ai/from-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data; // returns { id, title, description, ... }
};
