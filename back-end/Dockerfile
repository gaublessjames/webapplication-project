FROM python:3.11-slim

# Install postgresql-client for pg_isready
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN python -m venv /venv \
    && /venv/bin/pip install --upgrade pip \
    && /venv/bin/pip install -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1
ENV PATH="/venv/bin:$PATH"

RUN chmod +x /app/entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"] 