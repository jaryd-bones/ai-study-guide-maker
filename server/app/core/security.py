from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import jwt

from .config import getSettings

settings = getSettings()


def getPasswordHash(password: str) -> str:
  passwordBytes = password.encode("utf-8")
  salt = bcrypt.gensalt()
  hashed = bcrypt.hashpw(passwordBytes, salt)
  return hashed.decode("utf-8")


def verifyPassword(plainPassword: str, hashedPassword: str) -> bool:
  return bcrypt.checkpw(
    plainPassword.encode("utf-8"),
    hashedPassword.encode("utf-8"),
  )


def createAccessToken(
  subject: str | int,
  expiresDelta: timedelta | None = None,
) -> str:
  if expiresDelta is None:
    expiresDelta = timedelta(minutes=settings.accessTokenExpireMinutes)

  expire = datetime.now(timezone.utc) + expiresDelta
  toEncode: dict[str, Any] = {"sub": str(subject), "exp": expire}
  encodedJwt = jwt.encode(
    toEncode,
    settings.jwtSecretKey,
    algorithm=settings.jwtAlgorithm,
  )
  return encodedJwt
