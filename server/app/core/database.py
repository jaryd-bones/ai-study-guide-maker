from collections.abc import Generator

from sqlmodel import SQLModel, create_engine, Session
from .config import getSettings

settings = getSettings()

connectArgs = {}
if settings.databaseUrl.startswith("sqlite"):
  connectArgs = {"check_same_thread": False}

engine = create_engine(settings.databaseUrl, echo=False, connect_args=connectArgs)

def initDb() -> None:
  from app.models.userModel import User
  from app.models.studyGuideModel import StudyGuide
  from app.models.flashcardModel import Flashcard

  SQLModel.metadata.create_all(bind=engine)

def getSession() -> Generator[Session, None, None]:
  with Session(engine) as session:
    yield session
