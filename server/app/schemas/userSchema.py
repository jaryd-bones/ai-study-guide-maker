from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
  email: EmailStr
  firstName: str
  lastName: str

class UserCreate(UserBase):
  password: str

class UserRead(UserBase):
  id: int
