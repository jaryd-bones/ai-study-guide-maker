from typing import Optional
from pydantic import BaseModel

class StudyGuideBase(BaseModel):
  title: str
  description: Optional[str] = None

class StudyGuideCreate(StudyGuideBase):
  pass

class StudyGuideRead(StudyGuideBase):
  id: int

class AIStudyGuideFromTextRequest(BaseModel):
  text: str
  title: Optional[str] = None
  description: Optional[str] = None
