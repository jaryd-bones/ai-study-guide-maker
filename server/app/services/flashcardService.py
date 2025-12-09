from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.models.studyGuideModel import StudyGuide
from app.models.flashcardModel import Flashcard, FlashcardStatus

_FLASHCARD_FIELD_MAPPING = {
  "frontText": "front_text",
  "backText": "back_text",
  "orderIndex": "order_index",
}

def _getGuideOr404(
  db: Session,
  guideId: int,
  userId: int,
) -> StudyGuide:
  guide = db.get(StudyGuide, guideId)
  if not guide or guide.user_id != userId:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Study guide not found",
    )
  return guide

def _getCardOr403(
  db: Session,
  cardId: int,
  userId: int,
) -> Flashcard:
  card = db.get(Flashcard, cardId)
  if not card:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Flashcard not found",
    )

  guide = db.get(StudyGuide, card.study_guide_id)
  # If flashcard does not belong to user
  if not guide or guide.user_id != userId:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Not authorized",
    )

  return card


def _applyFlashcardUpdates(card: Flashcard, updateData: dict) -> None:
  for field, value in updateData.items():
    dbField = _FLASHCARD_FIELD_MAPPING.get(field, field)
    setattr(card, dbField, value)


def createFlashcard(
  db: Session,
  guideId: int,
  userId: int,
  frontText: str,
  backText: str,
  statusValue,
  orderIndex: int | None,
) -> Flashcard:
  _getGuideOr404(db, guideId, userId)

  card = Flashcard(
    study_guide_id=guideId,
    front_text=frontText,
    back_text=backText,
    status=statusValue or FlashcardStatus.NEEDS_REVIEW,
    order_index=orderIndex or 0,
  )
  db.add(card)
  db.commit()
  db.refresh(card)
  return card


def listFlashcards(
  db: Session,
  guideId: int,
  userId: int,
) -> list[Flashcard]:
  _getGuideOr404(db, guideId, userId)

  stmt = (
    select(Flashcard)
    .where(Flashcard.study_guide_id == guideId)
    .order_by(Flashcard.order_index)
  )
  return db.exec(stmt).all()

def updateFlashcard(
  db: Session,
  cardId: int,
  userId: int,
  updateData: dict,
) -> Flashcard:
  card = _getCardOr403(db, cardId, userId)

  _applyFlashcardUpdates(card, updateData)

  db.add(card)
  db.commit()
  db.refresh(card)
  return card


def deleteFlashcard(
  db: Session,
  cardId: int,
  userId: int,
) -> None:
  card = _getCardOr403(db, cardId, userId)

  db.delete(card)
  db.commit()
