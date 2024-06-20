from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID


Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    username = Column(String(25), unique=True)
    email = Column(String(100), unique=True)
    password = Column(String(1000))


class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE")
    )
    task = Column(String(100))
    completed = Column(Boolean)
    created_at = Column(DateTime(timezone=True))


class ArchiveTask(Base):
    __tablename__ = "archive_tasks"
    task_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE")
    )
    task = Column(String(100))
    completed = Column(Boolean)
    created_at = Column(DateTime(timezone=True))
