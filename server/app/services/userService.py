from typing import Optional
from sqlmodel import Session, select
from app.models.userModel import User
from app.core.security import getPasswordHash
from app.schemas.userSchema import UserCreate

def getUserByEmail(db: Session, email: str) -> Optional[User]:
  return db.exec(
    select(User).where(User.email == email)
  ).first()

def createUser(db: Session, userIn: UserCreate) -> User:
  user = User(
    email=userIn.email,
    password_hash=getPasswordHash(userIn.password),
    first_name=userIn.firstName,
    last_name=userIn.lastName,
  )
  db.add(user)
  db.commit()
  db.refresh(user)
  return user
