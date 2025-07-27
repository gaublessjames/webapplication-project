# Database Configuration Guide

This document explains the standardized PostgreSQL database configuration for the Café Fausse backend application.

## Standard Connection String Format

All database connection strings follow this standardized format:

```
postgresql://username:password@host:port/database_name
```

### Components:
- **username**: Database user (e.g., `postgres`, `cafe_fausse_user`)
- **password**: Database password
- **host**: Database server hostname or IP address
- **port**: Database port (default: `5432`)
- **database_name**: Database name (standardized to `cafe_fausse_2`)

## Configuration Files

### 1. `config.py` - Centralized Configuration
The main configuration file that defines all database settings:

```python
# Standard database URL examples
DATABASE_URL_EXAMPLES = {
    'local': 'postgresql://postgres:postgres@localhost:5432/cafe_fausse_2',
    'neon': 'postgresql://username:password@ep-cool-forest-123456.us-east-1.aws.neon.tech/cafe_fausse_2?sslmode=require',
    'supabase': 'postgresql://postgres:password@db.supabase.co:5432/postgres',
    'railway': 'postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway',
    'docker': 'postgresql://cafe_fausse_user:cafe_fausse_pass@db:5432/cafe_fausse_2'
}
```

### 2. `app.py` - Application Configuration
Uses the centralized configuration:

```python
from config import config

def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    # ...
```

### 3. `docker-compose.yml` - Docker Environment
Standardized Docker configuration:

```yaml
services:
  db:
    environment:
      POSTGRES_DB: cafe_fausse_2
      POSTGRES_USER: cafe_fausse_user
      POSTGRES_PASSWORD: cafe_fausse_pass
  
  backend:
    environment:
      DATABASE_URL: postgresql://cafe_fausse_user:cafe_fausse_pass@db:5432/cafe_fausse_2
```

### 4. `.env` - Environment Variables
Standardized environment file:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cafe_fausse_2
```

## Database Setup Options

### 1. Local Development
```bash
# Create database
createdb cafe_fausse_2

# Or using psql
psql -U postgres
CREATE DATABASE cafe_fausse_2;
```

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/cafe_fausse_2
```

### 2. Docker Development
```bash
# Start the full stack
docker-compose up

# Or just the database
docker-compose up db
```

**Connection String:**
```
postgresql://cafe_fausse_user:cafe_fausse_pass@db:5432/cafe_fausse_2
```

### 3. Remote Services

#### Neon (Recommended)
1. Sign up at https://neon.tech
2. Create a new project
3. Create database named `cafe_fausse_2`
4. Copy connection string

**Connection String:**
```
postgresql://username:password@ep-cool-forest-123456.us-east-1.aws.neon.tech/cafe_fausse_2?sslmode=require
```

#### Supabase
1. Sign up at https://supabase.com
2. Create a new project
3. Use the default database

**Connection String:**
```
postgresql://postgres:password@db.supabase.co:5432/postgres
```

#### Railway
1. Sign up at https://railway.app
2. Create a new PostgreSQL service
3. Copy connection string

**Connection String:**
```
postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

## Migration Scripts

### 1. `migrate_to_cafe_fausse_2.py`
Automated migration script to transition from old database to `cafe_fausse_2`:

```bash
# Run migration
python migrate_to_cafe_fausse_2.py

# Get database creation instructions
python migrate_to_cafe_fausse_2.py --create
```

### 2. `setup_env.py`
Creates standardized `.env` file:

```bash
python setup_env.py
```

### 3. `setup_database.py`
Guides through database setup process:

```bash
python setup_database.py
```

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Flask secret key
- `FLASK_ENV`: Environment (development/production)

### Optional Variables
- `DEBUG`: Enable debug mode (True/False)
- `SMTP_*`: Email configuration
- `RESTAURANT_*`: Application configuration

## Testing Database Connection

### 1. Health Check Endpoint
```bash
curl http://localhost:5001/health
```

### 2. Direct Database Test
```bash
# Using psql
psql "postgresql://postgres:postgres@localhost:5432/cafe_fausse_2"

# Using Python
python -c "
from app import create_app
from models import db
app = create_app()
with app.app_context():
    db.session.execute('SELECT 1')
    print('Database connection successful!')
"
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if PostgreSQL is running
   - Verify host and port
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions
   - Ensure database exists

3. **Database Does Not Exist**
   - Create the database: `CREATE DATABASE cafe_fausse_2;`
   - Run migrations: `flask db upgrade`

4. **Migration Errors**
   - Reset migrations: `rm -rf migrations/versions/*`
   - Reinitialize: `flask db init`
   - Create new migration: `flask db migrate`

### Reset Database
```bash
# Stop containers
docker-compose down

# Remove volume
docker volume rm webapplication-project_postgres_data

# Restart
docker-compose up
```

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database users
3. **Enable SSL** for production databases
4. **Restrict database access** to application servers only
5. **Regular backups** of production databases

## Best Practices

1. **Use environment-specific configurations**
2. **Test database connections** before deployment
3. **Monitor database performance** and connections
4. **Keep database credentials** secure and rotated
5. **Document any custom database configurations** 