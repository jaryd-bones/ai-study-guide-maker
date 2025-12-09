from functools import lru_cache
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
  appName: str = "AI Study Guide Maker"

  # Database
  databaseUrl: str = Field(
    default=os.getenv(
      "DATABASE_URL",
      "postgresql+psycopg2://postgres:postgres@localhost:5433/study_guide_db",
    )
  )

  # Auth
  jwtSecretKey: str = Field(default=os.getenv("JWT_SECRET_KEY", "change-me-in-prod"))
  jwtAlgorithm: str = "HS256"
  accessTokenExpireMinutes: int = 60 * 24  # 24 hours

  # OpenAI
  openaiApiKey: str | None = Field(default=os.getenv("OPENAI_API_KEY"))


@lru_cache
def getSettings() -> Settings:
  return Settings()
