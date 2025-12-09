from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field, Column, String

class FlashcardStatus(str, Enum):
  NEEDS_REVIEW = "needs_review"
  MEMORIZED = "memorized"

class Flashcard(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)

  study_guide_id: int = Field(
    foreign_key="studyguide.id",
    index=True,
  )

  front_text: str
  back_text: str

  status: FlashcardStatus = Field(
    sa_column=Column(String, nullable=False, index=True),
    default=FlashcardStatus.NEEDS_REVIEW,
  )

  order_index: int = Field(default=0)
