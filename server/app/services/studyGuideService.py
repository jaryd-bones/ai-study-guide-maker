from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.models.studyGuideModel import StudyGuide
from app.models.flashcardModel import Flashcard, FlashcardStatus
from sqlalchemy import delete

# Helpers
def _resolveGuideText(
  aiResult: dict,
  title: str | None,
  description: str | None,
) -> tuple[str, str]:
  aiTitle = aiResult.get("title") or "Untitled Study Guide"
  aiDescription = aiResult.get("description") or ""

  finalTitle = (title or "").strip() or aiTitle
  finalDescription = (description or "").strip() or aiDescription

  return finalTitle, finalDescription


def _createFlashcardsFromAiResult(
  db: Session,
  guideId: int,
  aiResult: dict,
) -> None:
  flashcardsData = aiResult.get("flashcards", []) or []

  for cardData in flashcardsData:
    front = cardData.get("front_text")
    back = cardData.get("back_text")
    if not front or not back:
      continue

    card = Flashcard(
      study_guide_id=guideId,
      front_text=front,
      back_text=back,
      status=FlashcardStatus.NEEDS_REVIEW,
      order_index=0,
    )
    db.add(card)


# Public service methods
def listStudyGuides(db: Session, userId: int) -> list[StudyGuide]:
  """Return all study guides owned by a specific user."""
  stmt = select(StudyGuide).where(StudyGuide.user_id == userId)
  return db.exec(stmt).all()


def getStudyGuide(
  db: Session,
  guideId: int,
  userId: int,
) -> StudyGuide:
  """Fetch a study guide while enforcing ownership."""
  guide = db.get(StudyGuide, guideId)
  if not guide or guide.user_id != userId:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Study guide not found",
    )
  return guide


def createStudyGuide(
  db: Session,
  userId: int,
  title: str,
  description: str | None,
) -> StudyGuide:
  guide = StudyGuide(
    user_id=userId,
    title=title,
    description=description,
  )
  db.add(guide)
  db.commit()
  db.refresh(guide)
  return guide


def updateStudyGuide(
  db: Session,
  guideId: int,
  userId: int,
  title: str,
  description: str | None,
) -> StudyGuide:
  guide = getStudyGuide(db, guideId, userId)
  guide.title = title
  guide.description = description

  db.add(guide)
  db.commit()
  db.refresh(guide)
  return guide


def deleteStudyGuideAndFlashcards(
  db: Session,
  userId: int,
  guideId: int,
) -> None:
  guide = getStudyGuide(db, guideId, userId)

  stmt = delete(Flashcard).where(Flashcard.study_guide_id == guideId)
  db.exec(stmt)

  db.delete(guide)
  db.commit()


def createStudyGuideFromAiResult(
  db: Session,
  userId: int,
  aiResult: dict,
  title: str | None,
  description: str | None,
) -> StudyGuide:
  finalTitle, finalDescription = _resolveGuideText(aiResult, title, description)

  guide = createStudyGuide(
    db=db,
    userId=userId,
    title=finalTitle,
    description=finalDescription,
  )

  _createFlashcardsFromAiResult(db, guide.id, aiResult)

  db.commit()
  return guide
