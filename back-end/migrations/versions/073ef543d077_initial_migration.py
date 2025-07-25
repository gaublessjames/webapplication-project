"""Initial migration

Revision ID: 073ef543d077
Revises: 
Create Date: 2025-07-22 19:30:18.898326

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision = '073ef543d077'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    if 'awards' not in existing_tables:
        op.create_table('awards',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(length=200), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('year', sa.Integer(), nullable=True),
            sa.Column('category', sa.String(length=100), nullable=True),
            sa.Column('image_url', sa.String(length=500), nullable=True),
            sa.Column('is_featured', sa.Boolean(), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    if 'menu_categories' not in existing_tables:
        op.create_table('menu_categories',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    if 'newsletter_subscribers' not in existing_tables:
        op.create_table('newsletter_subscribers',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('email', sa.String(length=120), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('subscribed_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('email')
        )
    # Always attempt to create the users table if it does not exist
    op.create_table('users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False, unique=True),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='user'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Always create the reservations table if it does not exist
    if 'reservations' not in existing_tables:
        op.create_table('reservations',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('email', sa.String(length=120), nullable=False),
            sa.Column('phone', sa.String(length=20), nullable=False),
            sa.Column('date', sa.Date(), nullable=False),
            sa.Column('time', sa.Time(), nullable=False),
            sa.Column('party_size', sa.Integer(), nullable=False),
            sa.Column('special_requests', sa.Text(), nullable=True),
            sa.Column('status', sa.String(length=20), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('user_id', sa.UUID(), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id']),
            sa.PrimaryKeyConstraint('id')
        )
    # Do not inspect or alter columns if the table does not exist
    if 'restaurant_info' not in existing_tables:
        op.create_table('restaurant_info',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('address', sa.Text(), nullable=False),
            sa.Column('phone', sa.String(length=20), nullable=False),
            sa.Column('email', sa.String(length=120), nullable=True),
            sa.Column('website', sa.String(length=200), nullable=True),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('mission', sa.Text(), nullable=True),
            sa.Column('history', sa.Text(), nullable=True),
            sa.Column('hours', sa.JSON(), nullable=True),
            sa.Column('social_media', sa.JSON(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    if 'testimonials' not in existing_tables:
        op.create_table('testimonials',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('customer_name', sa.String(length=100), nullable=False),
            sa.Column('rating', sa.Integer(), nullable=False),
            sa.Column('comment', sa.Text(), nullable=False),
            sa.Column('is_featured', sa.Boolean(), nullable=True),
            sa.Column('is_approved', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    if 'menu_items' not in existing_tables:
        op.create_table('menu_items',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column('category_id', sa.UUID(), nullable=False),
            sa.Column('is_vegetarian', sa.Boolean(), nullable=True),
            sa.Column('is_gluten_free', sa.Boolean(), nullable=True),
            sa.Column('is_spicy', sa.Boolean(), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['category_id'], ['menu_categories.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('menu_items')
    op.drop_table('testimonials')
    op.drop_table('restaurant_info')
    op.drop_table('reservations')
    op.drop_table('users')
    op.drop_table('newsletter_subscribers')
    op.drop_table('menu_categories')
    op.drop_table('awards')
    # ### end Alembic commands ###