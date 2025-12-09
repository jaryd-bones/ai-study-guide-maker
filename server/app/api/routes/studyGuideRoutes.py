from typing import List
from fastapi import (
  APIRouter,
  Depends,
  HTTPException,
  status,
  UploadFile,
  File,
  Form,
)
from sqlmodel import Session
from app.api.deps import getDb, getCurrentUser
from app.models.userModel import User
from app.models.studyGuideModel import StudyGuide
from app.schemas.studyGuideSchema import (
  StudyGuideCreate,
  StudyGuideRead,
  AIStudyGuideFromTextRequest,
)
from app.services.aiStudyGuideService import generateStudyGuideFromText
from app.services.textExtractionService import extractTextFromUpload
from app.services.studyGuideService import (
  listStudyGuides as listStudyGuidesForUser,
  getStudyGuide as getStudyGuideForUserOr404,
  createStudyGuide as createStudyGuideInDb,
  updateStudyGuide as updateStudyGuideInDb,
  deleteStudyGuideAndFlashcards,
  createStudyGuideFromAiResult,
)

router = APIRouter(prefix="/study-guides", tags=["study-guides"])


# Helpers
def _normalizeOptionalStr(value: str | None) -> str | None:
  return (value or "").strip() or None


def _toStudyGuideRead(guide: StudyGuide) -> StudyGuideRead:
  return StudyGuideRead(
    id=guide.id,
    title=guide.title,
    description=guide.description,
  )


def _raiseAiError(endpoint: str, error: Exception) -> None:
  import traceback

  print(f"ERROR in {endpoint} generateStudyGuideFromText:")
  traceback.print_exc()
  raise HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail=f"AI generation failed in {endpoint}: {type(error).__name__}: {error}",
  )


def _createStudyGuideFromRawText(
  rawText: str,
  title: str | None,
  description: str | None,
  endpoint: str,
  db: Session,
  userId: int,
) -> StudyGuideRead:
  userTitle = _normalizeOptionalStr(title)
  userDescription = _normalizeOptionalStr(description)

  try:
    aiResult = generateStudyGuideFromText(
      rawText=rawText,
      title=userTitle,
      description=userDescription,
    )
  except Exception as e:
    _raiseAiError(endpoint, e)

  guide = createStudyGuideFromAiResult(
    db=db,
    userId=userId,
    aiResult=aiResult,
    title=userTitle,
    description=userDescription,
  )

  return _toStudyGuideRead(guide)


# Study guide endpoints
@router.post("/", response_model=StudyGuideRead, status_code=status.HTTP_201_CREATED)
def createStudyGuide(
  guideIn: StudyGuideCreate,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> StudyGuideRead:
  guide = createStudyGuideInDb(
    db=db,
    userId=currentUser.id,
    title=guideIn.title,
    description=guideIn.description,
  )
  return _toStudyGuideRead(guide)


@router.get("/", response_model=List[StudyGuideRead])
def listStudyGuides(
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> list[StudyGuideRead]:
  guides = listStudyGuidesForUser(db, currentUser.id)
  return [_toStudyGuideRead(g) for g in guides]


@router.get("/{guideId}", response_model=StudyGuideRead)
def getStudyGuide(
  guideId: int,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> StudyGuideRead:
  guide = getStudyGuideForUserOr404(db, guideId, currentUser.id)
  return _toStudyGuideRead(guide)


@router.patch("/{guideId}", response_model=StudyGuideRead)
def updateStudyGuide(
  guideId: int,
  guideIn: StudyGuideCreate,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> StudyGuideRead:
  guide = updateStudyGuideInDb(
    db=db,
    guideId=guideId,
    userId=currentUser.id,
    title=guideIn.title,
    description=guideIn.description,
  )
  return _toStudyGuideRead(guide)


@router.delete("/{guideId}", status_code=status.HTTP_204_NO_CONTENT)
def deleteStudyGuide(
  guideId: int,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> None:
  deleteStudyGuideAndFlashcards(db, currentUser.id, guideId)
  return


# AI endpoints
@router.post(
  "/ai/from-text",
  response_model=StudyGuideRead,
  status_code=status.HTTP_201_CREATED,
)
def createStudyGuideFromText(
  payload: AIStudyGuideFromTextRequest,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> StudyGuideRead:
  return _createStudyGuideFromRawText(
    rawText=payload.text,
    title=payload.title,
    description=payload.description,
    endpoint="/study-guides/ai/from-text",
    db=db,
    userId=currentUser.id,
  )


@router.post(
  "/ai/from-upload",
  response_model=StudyGuideRead,
  status_code=status.HTTP_201_CREATED,
)
async def createStudyGuideFromUpload(
  file: UploadFile = File(...),
  title: str | None = Form(None),
  description: str | None = Form(None),
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> StudyGuideRead:
  try:
    rawText = await extractTextFromUpload(file)
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=f"Failed to process uploaded file: {e}",
    )

  if not rawText or not rawText.strip():
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Uploaded file appears to have no extractable text.",
    )

  return _createStudyGuideFromRawText(
    rawText=rawText,
    title=title,
    description=description,
    endpoint="/study-guides/ai/from-upload",
    db=db,
    userId=currentUser.id,
  )
