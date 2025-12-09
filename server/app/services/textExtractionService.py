from typing import Final
import io
from fastapi import UploadFile
from PIL import Image
import fitz  # PyMuPDF
import pytesseract

# Point pytesseract to the installed Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

_SUPPORTED_IMAGE_EXTENSIONS: Final[tuple[str, ...]] = (
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
)

# Helpers
async def _readUploadBytes(uploadFile: UploadFile) -> bytes:
    await uploadFile.seek(0)
    return await uploadFile.read()


def _fileIsPdf(uploadFile: UploadFile) -> bool:
    contentType = (uploadFile.content_type or "").lower()
    filename = (uploadFile.filename or "").lower()
    return "pdf" in contentType or filename.endswith(".pdf")


def _fileIsImage(uploadFile: UploadFile) -> bool:
    contentType = (uploadFile.content_type or "").lower()
    filename = (uploadFile.filename or "").lower()
    return ("image" in contentType) or filename.endswith(_SUPPORTED_IMAGE_EXTENSIONS)


async def _extractPainText(uploadFile: UploadFile) -> str:
    rawBytes = await _readUploadBytes(uploadFile)
    try:
        return rawBytes.decode("utf-8", errors="ignore").strip()
    except Exception:
        return ""


# Public extraction functions
async def extractTextFromPdf(uploadFile: UploadFile) -> str:
    fileBytes = await _readUploadBytes(uploadFile)
    document = fitz.open(stream=fileBytes, filetype="pdf")

    pageTexts: list[str] = []
    try:
        for page in document:
            pageTexts.append(page.get_text())
    finally:
        document.close()

    return "\n\n".join(pageTexts).strip()


async def extractTextFromImage(uploadFile: UploadFile) -> str:
    fileBytes = await _readUploadBytes(uploadFile)

    image = Image.open(io.BytesIO(fileBytes))
    text = pytesseract.image_to_string(image)

    return text.strip()


async def extractTextFromUpload(uploadFile: UploadFile) -> str:
    if _fileIsPdf(uploadFile):
        return await extractTextFromPdf(uploadFile)
    elif _fileIsImage(uploadFile):
        return await extractTextFromImage(uploadFile)
    else:
        return await _extractPainText(uploadFile)
