"""empty message

Revision ID: 4dd4798489b9
Revises: 88693d85cd56
Create Date: 2025-07-23 19:11:18.493306

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4dd4798489b9'
down_revision = '88693d85cd56'
branch_labels = None
depends_on = None


def upgrade():
    # Remove duplicate table creation for customers and profiles
    pass


def downgrade():
    # Remove duplicate table drop for customers and profiles
    pass
