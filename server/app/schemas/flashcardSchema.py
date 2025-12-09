from typing import Optional
from sqlmodel import SQLModel
from app.models.flashcardModel import FlashcardStatus

class FlashcardBase(SQLModel):
  frontText: str
  backText: str

class FlashcardCreate(FlashcardBase):
  # Defaults to needs review
  status: Optional[FlashcardStatus] = None
  orderIndex: Optional[int] = 0


class FlashcardRead(FlashcardBase):
  id: int
  studyGuideId: int
  status: FlashcardStatus
  orderIndex: int

  class Config:
    from_attributes = True

class FlashcardUpdate(SQLModel):
  frontText: Optional[str] = None
  backText: Optional[str] = None
  status: Optional[FlashcardStatus] = None
  orderIndex: Optional[int] = None
