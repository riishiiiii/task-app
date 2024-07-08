"""populate_priority

Revision ID: c2294adf3fcb
Revises: 2a739bba18b3
Create Date: 2024-07-08 06:02:17.400514

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = "c2294adf3fcb"
down_revision: Union[str, None] = "2a739bba18b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Low')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Medium')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('High')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Urgent')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Immediate')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Critical')"))
    bind.execute(text("INSERT INTO task_priority (priority) VALUES ('Blocker')"))


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        text(
            "DELETE FROM task_priority WHERE priority IN ('Low', 'Medium', 'High', 'Urgent', 'Immediate', 'Critical', 'Blocker')"
        )
    )
