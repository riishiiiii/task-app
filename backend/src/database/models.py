from sqlalchemy import (
    Column,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Integer,
    PrimaryKeyConstraint,
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID


Base = declarative_base()

# ----------------- User ----------------- #


class User(Base):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    username = Column(String(250), unique=True)
    email = Column(String(100), unique=True)
    password = Column(String(1000))


# ----------------- Task ----------------- #


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


# ----------------- Project ----------------- #


class Project(Base):
    __tablename__ = "projects"
    project_id = Column(UUID(as_uuid=True), primary_key=True)
    owner_id = Column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE")
    )
    owner = relationship("User")
    project_name = Column(String(100))
    created_at = Column(DateTime(timezone=True))


class ProjectStatus(Base):
    __tablename__ = "project_status"
    project_status_id = Column(Integer, primary_key=True)
    status = Column(String(100))


class ProjectLabels(Base):
    __tablename__ = "project_labels"
    label_id = Column(UUID(as_uuid=True), primary_key=True)
    label = Column(String(100))
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE")
    )
    project = relationship("Project")


class ProjectTask(Base):
    __tablename__ = "project_tasks"
    project_task_id = Column(UUID(as_uuid=True), primary_key=True)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE")
    )
    project = relationship("Project")
    task = Column(String(100))
    status_id = Column(
        Integer,
        ForeignKey("project_status.project_status_id", ondelete="CASCADE"),
        nullable=True,
    )
    status = relationship("ProjectStatus")
    created_by = Column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE")
    )
    created_by_user = relationship("User")
    label_id = Column(
        UUID(as_uuid=True),
        ForeignKey("project_labels.label_id", ondelete="CASCADE"),
        nullable=True,
    )
    label = relationship("ProjectLabels")
    created_at = Column(DateTime(timezone=True))


class ProjectMembers(Base):
    __tablename__ = "project_members"
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE")
    )
    project = relationship("Project", backref="members")
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE")
    )
    user = relationship("User")

    __table_args__ = (PrimaryKeyConstraint("project_id", "user_id"),)
