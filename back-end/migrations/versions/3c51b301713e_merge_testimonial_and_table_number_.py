"""merge testimonial and table_number migrations

Revision ID: 3c51b301713e
Revises: add_review_title_to_testimonials, add_table_number_column
Create Date: 2025-07-24 18:39:56.411552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c51b301713e'
down_revision = ('add_review_title_to_testimonials', 'add_table_number_column')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
