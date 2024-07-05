from pydantic import BaseModel
from typing import Optional
import uuid
import datetime


class CreateNote(BaseModel):
    note_title: str
    note: str


class UpdateNote(BaseModel):
    note_title: Optional[str] = None
    note: Optional[str] = None


class SingleNote(BaseModel):
    note_id: uuid.UUID
    note_title: str
    note: str
    created_at: datetime.datetime
    created_by: uuid.UUID
