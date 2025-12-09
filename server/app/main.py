from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import initDb
from app.api.routes.authRoutes import router as authRouter
from app.api.routes.studyGuideRoutes import router as studyGuidesRouter
from app.api.routes.flashcardRoutes import router as flashcardsRouter


def _configureCors(app: FastAPI) -> None:
  allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]

  app.add_middleware(
    CORSMiddleware,
    allow_origins=allowedOrigins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

def _registerRouters(app: FastAPI) -> None:
  app.include_router(authRouter)
  app.include_router(studyGuidesRouter)
  app.include_router(flashcardsRouter)


@asynccontextmanager
async def lifespan(app: FastAPI):
  initDb()
  yield

def createApp() -> FastAPI:
  app = FastAPI(
    title="AI Study Guide Maker API",
    version="1.0.0",
    lifespan=lifespan,
  )

  _configureCors(app)
  _registerRouters(app)

  return app

app = createApp()
