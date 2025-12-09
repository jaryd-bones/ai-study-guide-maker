from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from app.core.config import getSettings
from app.core.database import getSession
from app.models.userModel import User

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
settings = getSettings()

def getDb() -> Generator[Session, None, None]:
  yield from getSession()


def getCurrentUser(
  token: str = Depends(oauth2Scheme),
  db: Session = Depends(getDb),
) -> User:
  credentialsException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )

  try:
    payload = jwt.decode(
      token,
      settings.jwtSecretKey,
      algorithms=[settings.jwtAlgorithm],
    )
    userId: str | None = payload.get("sub")
    if userId is None:
      raise credentialsException
  except JWTError:
    raise credentialsException

  user = db.exec(select(User).where(User.id == int(userId))).first()
  if user is None:
    raise credentialsException

  return user
