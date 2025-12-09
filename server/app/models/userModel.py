from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import func

class User(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  email: str = Field(index=True, sa_column_kwargs={"unique": True})
  password_hash: str
  first_name: str
  last_name: str

  created_at: datetime = Field(
    default_factory=datetime.utcnow,
    sa_column_kwargs={"server_default": func.now()}
  )
