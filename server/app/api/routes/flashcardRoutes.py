from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.api.deps import getDb, getCurrentUser
from app.models.userModel import User
from app.models.flashcardModel import Flashcard
from app.schemas.flashcardSchema import (
  FlashcardCreate,
  FlashcardRead,
  FlashcardUpdate,
)
from app.services.flashcardService import (
  createFlashcard as createFlashcardService,
  listFlashcards as listFlashcardsService,
  updateFlashcard as updateFlashcardService,
  deleteFlashcard as deleteFlashcardService,
)

router = APIRouter(prefix="/study-guides", tags=["flashcards"])

def _toFlashcardRead(card: Flashcard) -> FlashcardRead:
  return FlashcardRead(
    id=card.id,
    studyGuideId=card.study_guide_id,
    frontText=card.front_text,
    backText=card.back_text,
    status=card.status,
    orderIndex=card.order_index,
  )

@router.post(
  "/{guideId}/flashcards",
  response_model=FlashcardRead,
  status_code=status.HTTP_201_CREATED,
)
def createFlashcardEndpoint(
  guideId: int,
  cardIn: FlashcardCreate,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> FlashcardRead:
  card = createFlashcardService(
    db=db,
    guideId=guideId,
    userId=currentUser.id,
    frontText=cardIn.frontText,
    backText=cardIn.backText,
    statusValue=cardIn.status,
    orderIndex=cardIn.orderIndex,
  )
  return _toFlashcardRead(card)


@router.get("/{guideId}/flashcards", response_model=List[FlashcardRead])
def listFlashcardsEndpoint(
  guideId: int,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> list[FlashcardRead]:
  cards = listFlashcardsService(
    db=db,
    guideId=guideId,
    userId=currentUser.id,
  )
  return [_toFlashcardRead(c) for c in cards]


@router.patch("/flashcards/{cardId}", response_model=FlashcardRead)
def updateFlashcardEndpoint(
  cardId: int,
  cardUpdate: FlashcardUpdate,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> FlashcardRead:
  updateData = cardUpdate.dict(exclude_unset=True)
  card = updateFlashcardService(
    db=db,
    cardId=cardId,
    userId=currentUser.id,
    updateData=updateData,
  )
  return _toFlashcardRead(card)


@router.delete("/flashcards/{cardId}", status_code=status.HTTP_204_NO_CONTENT)
def deleteFlashcardEndpoint(
  cardId: int,
  db: Session = Depends(getDb),
  currentUser: User = Depends(getCurrentUser),
) -> None:
  deleteFlashcardService(
    db=db,
    cardId=cardId,
    userId=currentUser.id,
  )
  return
