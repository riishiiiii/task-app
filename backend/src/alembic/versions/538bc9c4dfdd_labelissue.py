"""labelissue

Revision ID: 538bc9c4dfdd
Revises: 623bf12f90b5
Create Date: 2024-07-02 09:00:16.713329

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "538bc9c4dfdd"
down_revision: Union[str, None] = "623bf12f90b5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "project_labels",
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("project_labels", "created_at")
    # ### end Alembic commands ###
