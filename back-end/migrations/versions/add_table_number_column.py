"""Add table_number column to reservations table

Revision ID: add_table_number_column
Revises: 88693d85cd56
Create Date: 2025-07-24 15:02:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_table_number_column'
down_revision = '4dd4798489b9'
branch_labels = None
depends_on = None


def upgrade():
    # Add table_number column to reservations table
    op.add_column('reservations', sa.Column('table_number', sa.Integer(), nullable=True))
    op.add_column('menu_categories', sa.Column('icon', sa.String(length=10), nullable=True))


def downgrade():
    # Remove table_number column from reservations table
    op.drop_column('reservations', 'table_number')
    op.drop_column('menu_categories', 'icon')