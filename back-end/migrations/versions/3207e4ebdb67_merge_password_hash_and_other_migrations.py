"""merge password_hash and other migrations

Revision ID: 3207e4ebdb67
Revises: 3c51b301713e, add_password_hash_to_users
Create Date: 2025-07-24 19:42:58.509848

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3207e4ebdb67'
down_revision = ('3c51b301713e', 'add_password_hash_to_users')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
