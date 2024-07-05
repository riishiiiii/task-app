from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.tasknotes import CreateNote, UpdateNote, SingleNote
from service.projecttaskservice import TaskNotFound
import uuid
from database import models
import datetime


class NoteNotFound(Exception):
    def __init__(self, message: str = "Note not found"):
        self.message = message


class NoteAlreadyExists(Exception):
    def __init__(self, message: str = "Note already exists"):
        self.message = message


class TaskNoteService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def create_note(
        self, task_id: uuid.UUID, note: CreateNote, user: models.User
    ) -> SingleNote:
        task = (
            self.db.query(models.ProjectTask)
            .filter(models.ProjectTask.project_task_id == task_id)
            .first()
        )
        if not task:
            raise TaskNotFound()
        if task.task_note_id:
            raise NoteAlreadyExists()
        note_to_add = models.TaskNotes(
            note_id=uuid.uuid4(),
            note_title=note.note_title,
            note=note.note,
            created_at=datetime.datetime.now(tz=datetime.timezone.utc),
            created_by=user.user_id,
        )

        try:
            self.db.add(note_to_add)
            self.db.commit()
            self.db.refresh(note_to_add)
            task.task_note_id = note_to_add.note_id
            self.db.commit()
            return SingleNote(
                note_id=note_to_add.note_id,
                note_title=note_to_add.note_title,
                note=note_to_add.note,
                created_at=note_to_add.created_at,
                created_by=note_to_add.created_by,
            )
        except Exception as e:
            self.db.rollback()
            raise e

    async def update_note(self, note_id: uuid.UUID, note: UpdateNote):
        note_to_update = (
            self.db.query(models.TaskNotes)
            .filter(models.TaskNotes.note_id == note_id)
            .first()
        )
        if not note_to_update:
            raise NoteNotFound()

        note_update_dict = {}
        if note.note_title:
            note_update_dict["note_title"] = note.note_title
        if note.note:
            note_update_dict["note"] = note.note
        try:
            self.db.query(models.TaskNotes).filter(
                models.TaskNotes.note_id == note_id
            ).update(note_update_dict)
            self.db.commit()
            self.db.refresh(note_to_update)
            return SingleNote(
                note_id=note_to_update.note_id,
                note_title=note_to_update.note_title,
                note=note_to_update.note,
                created_at=note_to_update.created_at,
                created_by=note_to_update.created_by,
            )
        except Exception as e:
            self.db.rollback()
            raise e
