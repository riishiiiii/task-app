FROM python:3.11-slim-bullseye

WORKDIR /app

RUN apt update && apt install -y build-essential libpq-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && python3 src/app.py"]