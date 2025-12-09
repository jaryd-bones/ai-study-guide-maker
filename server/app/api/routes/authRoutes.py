from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import getDb
from app.core.security import verifyPassword, createAccessToken
from app.schemas.userSchema import UserCreate, UserRead
from app.schemas.authSchema import Token, LoginRequest
from app.services.userService import getUserByEmail, createUser

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def registerUser(userIn: UserCreate, db: Session = Depends(getDb)) -> UserRead:
  existingUser = getUserByEmail(db, userIn.email)
  if existingUser:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Email already registered",
    )

  user = createUser(db, userIn)

  return UserRead(
    id=user.id,
    email=user.email,
    firstName=user.first_name,
    lastName=user.last_name,
  )


@router.post("/login", response_model=Token)
def login(loginData: LoginRequest, db: Session = Depends(getDb)) -> Token:
  user = getUserByEmail(db, loginData.email)

  if not user or not verifyPassword(loginData.password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect email or password",
      headers={"WWW-Authenticate": "Bearer"},
    )

  accessToken = createAccessToken(subject=user.id)
  return Token(accessToken=accessToken)
