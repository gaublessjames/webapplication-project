"""add users table and user_id column

Revision ID: 88693d85cd56
Revises: 073ef543d077
Create Date: 2025-07-23 18:44:34.082610

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = '88693d85cd56'
down_revision = '073ef543d077'
branch_labels = None
depends_on = None


def upgrade():
    # Remove users table creation (already created in initial migration)
    # Create customers table if it doesn't exist
    op.create_table(
        'customers',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('email', sa.String(120), unique=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('newsletter_signup', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime())
    )
    # Create profiles table if it doesn't exist
    op.create_table(
        'profiles',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('user_id', sa.UUID(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('role', sa.String(20), nullable=True),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime())
    )
    # Add user_id column to reservations if it doesn't exist
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [col['name'] for col in inspector.get_columns('reservations')]
    if 'user_id' not in columns:
        with op.batch_alter_table('reservations') as batch_op:
            batch_op.add_column(sa.Column('user_id', sa.UUID(), nullable=True))
            batch_op.create_foreign_key('fk_reservations_user_id', 'users', ['user_id'], ['id'])


def downgrade():
    # Remove user_id column and foreign key from reservations
    with op.batch_alter_table('reservations') as batch_op:
        batch_op.drop_constraint('fk_reservations_user_id', type_='foreignkey')
        batch_op.drop_column('user_id')
    # Drop users table
    op.drop_table('users')
    op.drop_table('profiles')
    op.drop_table('customers')
