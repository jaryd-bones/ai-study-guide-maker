from typing import Optional
from sqlmodel import SQLModel, Field

class StudyGuide(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  user_id: int = Field(foreign_key="user.id", index=True)
  title: str
  description: Optional[str] = None
