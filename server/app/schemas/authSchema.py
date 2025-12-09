from pydantic import BaseModel, EmailStr

class Token(BaseModel):
  accessToken: str
  tokenType: str = "bearer"

class LoginRequest(BaseModel):
  email: EmailStr
  password: str
