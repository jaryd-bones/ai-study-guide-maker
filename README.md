AI Study Guide Maker

Project Overview
----------------
AI Study Guide Maker is a full stack web application built to automate the process of turning lecture notes and study materials into structured flashcard sets. It reduces manual study prep by converting raw text, PDFs, or images into organized, review-ready content using GPT-4o mini.

The application is split into two parts: a Vite + React frontend that provides the user interface, and a FastAPI backend that handles file and text ingestion, OCR and PDF extraction, AI driven content generation, persistence, and token based authentication.

Key Features
------------
- Generate structured flashcard sets from raw text or uploaded documents.
- Persist study guides and flashcards with user scoped access.
- Upload support for PDFs and images using OCR (`pytesseract`) and PDF text extraction (`PyMuPDF`).
- AI integration that requests strict JSON output and validates and normalizes results on the server.
- Full CRUD support for study guides and flashcards via REST endpoints.

Tech Stack
----------
- Frontend: React, Vite, Axios, Bootstrap
- Backend: Python, FastAPI, Uvicorn
- Data layer: SQLModel / SQLAlchemy, PostgreSQL
- AI & extraction: OpenAI Python SDK, PyMuPDF, pytesseract
- Dev tooling: node/npm, pip, python-dotenv

Architecture / Implementation Notes
----------------------------------
This section is intended for readers interested in internal design and implementation details.

- Repository layout: `client/` contains the React frontend, while `server/` contains the FastAPI backend.
- Frontend and backend communication: The frontend reads `import.meta.env.VITE_API_BASE_URL` (defaulting to `http://localhost:8000`) and sends requests to REST endpoints defined under `server/app/api/routes`.
- Backend structure: Route handlers are intentionally thin and delegate logic to service modules under `server/app/services/` (for example, `aiStudyGuideService.py`, `textExtractionService.py`, `studyGuideService.py`). This keeps HTTP concerns separate from business logic.
- AI integration: `aiStudyGuideService.generateStudyGuideFromText()` constructs a tightly constrained system prompt that requires the model to return JSON only, containing a title, description, and flashcards (`front_text` / `back_text`). Responses are parsed with `json.loads`, validated, and normalized before being returned.
- File and text ingestion: `textExtractionService.py` inspects uploaded files, extracts text from PDFs using `PyMuPDF`, runs OCR on images using `pytesseract`, and falls back to raw byte to text decoding for plain text inputs.
- Application lifecycle: `server/app/main.py` initializes the database via `initDb()` during the FastAPI lifespan context and registers routers. CORS is configured to allow requests from the Vite development server by default.

Notable Engineering Challenges
------------------------------
1) Ensuring machine generated output is parseable JSON  
   - Approach: Use a tightly constrained system prompt, enforce `json.loads` on the backend, log parse failures, and normalize missing fields. This prevents unstructured AI output from reaching persistence or the UI.

2) Handling varied upload types (PDFs, images, plain text)  
   - Approach: Centralize extraction logic in `textExtractionService.py` with explicit handling for PDFs, images, and raw text. Image OCR requires a local Tesseract binary; the path is configured in code for Windows via `pytesseract.pytesseract.tesseract_cmd`.

How to Run Locally
------------------
Prerequisites
- Node.js and npm
- Python 3.11+ with a virtual environment
- PostgreSQL (or an existing database configured via `DATABASE_URL`)
- Tesseract (required only for image OCR)

Backend (Windows / PowerShell example)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r server/requirements.txt
$env:OPENAI_API_KEY = 'your_openai_key_here'
uvicorn app.main:app --reload --port 8000
