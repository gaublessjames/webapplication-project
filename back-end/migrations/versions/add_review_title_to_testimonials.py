from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_review_title_to_testimonials'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('testimonials', sa.Column('title', sa.String(length=100), nullable=False, server_default=''))
    op.drop_column('testimonials', 'customer_name')

def downgrade():
    op.add_column('testimonials', sa.Column('customer_name', sa.String(length=100), nullable=False, server_default=''))
    op.drop_column('testimonials', 'title') 