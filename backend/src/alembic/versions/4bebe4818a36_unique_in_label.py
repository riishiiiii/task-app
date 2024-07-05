"""unique in label

Revision ID: 4bebe4818a36
Revises: 3afa95aa1819
Create Date: 2024-06-27 14:04:01.535294

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4bebe4818a36"
down_revision: Union[str, None] = "3afa95aa1819"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, "project_labels", ["label", "project_id"])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "project_labels", type_="unique")
    # ### end Alembic commands ###
