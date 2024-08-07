"""taskfieldsupdate

Revision ID: 7d5c1f00a514
Revises: 4bebe4818a36
Create Date: 2024-07-01 11:58:16.443431

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7d5c1f00a514"
down_revision: Union[str, None] = "4bebe4818a36"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "task_comments",
        sa.Column("comment_id", sa.UUID(), nullable=False),
        sa.Column("task_id", sa.UUID(), nullable=True),
        sa.Column("comment", sa.String(length=1000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.user_id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["task_id"], ["project_tasks.project_task_id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("comment_id"),
    )
    op.create_table(
        "task_notes",
        sa.Column("note_id", sa.UUID(), nullable=False),
        sa.Column("task_id", sa.UUID(), nullable=True),
        sa.Column("note_title", sa.String(length=100), nullable=True),
        sa.Column("note", sa.String(length=1000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.user_id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["task_id"], ["project_tasks.project_task_id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("note_id"),
    )
    op.create_table(
        "task_priority",
        sa.Column("priority_id", sa.Integer(), nullable=False),
        sa.Column("priority", sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint("priority_id"),
    )
    op.add_column(
        "project_tasks", sa.Column("priority_id", sa.Integer(), nullable=True)
    )
    op.add_column(
        "project_tasks", sa.Column("description", sa.String(length=1000), nullable=True)
    )
    op.add_column(
        "project_tasks",
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column("project_tasks", sa.Column("task_note_id", sa.UUID(), nullable=True))
    op.add_column(
        "project_tasks", sa.Column("task_comment_id", sa.UUID(), nullable=True)
    )
    op.drop_constraint(
        "project_tasks_status_id_fkey", "project_tasks", type_="foreignkey"
    )
    op.drop_table("project_status")
    op.create_foreign_key(
        None,
        "project_tasks",
        "task_notes",
        ["task_note_id"],
        ["note_id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        None,
        "project_tasks",
        "task_priority",
        ["priority_id"],
        ["priority_id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        None,
        "project_tasks",
        "task_comments",
        ["task_comment_id"],
        ["comment_id"],
        ondelete="CASCADE",
    )
    op.drop_column("project_tasks", "status_id")

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "project_tasks",
        sa.Column("status_id", sa.INTEGER(), autoincrement=False, nullable=True),
    )
    op.drop_constraint(None, "project_tasks", type_="foreignkey")
    op.drop_constraint(None, "project_tasks", type_="foreignkey")
    op.drop_constraint(None, "project_tasks", type_="foreignkey")
    op.create_foreign_key(
        "project_tasks_status_id_fkey",
        "project_tasks",
        "project_status",
        ["status_id"],
        ["project_status_id"],
        ondelete="CASCADE",
    )
    op.drop_column("project_tasks", "task_comment_id")
    op.drop_column("project_tasks", "task_note_id")
    op.drop_column("project_tasks", "due_date")
    op.drop_column("project_tasks", "description")
    op.drop_column("project_tasks", "priority_id")
    op.create_table(
        "project_status",
        sa.Column(
            "project_status_id", sa.INTEGER(), autoincrement=True, nullable=False
        ),
        sa.Column("status", sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint("project_status_id", name="project_status_pkey"),
    )
    op.drop_table("task_priority")
    op.drop_table("task_notes")
    op.drop_table("task_comments")
    # ### end Alembic commands ###
