"""Add default status

Revision ID: e18759dee88e
Revises: 0d36beadccf1
Create Date: 2024-06-25 13:12:31.713390

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = "e18759dee88e"
down_revision: Union[str, None] = "0d36beadccf1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    bind.execute(text("INSERT INTO project_status (status) VALUES ('To Do')"))
    bind.execute(text("INSERT INTO project_status (status) VALUES ('In Progress')"))
    bind.execute(text("INSERT INTO project_status (status) VALUES ('Done')"))
    bind.execute(text("INSERT INTO project_status (status) VALUES ('Archived')"))


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        text(
            "DELETE FROM project_status WHERE status IN ('To Do', 'In Progress', 'Done', 'Archived')"
        )
    )
