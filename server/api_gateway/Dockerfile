FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install django-redis

COPY . /app/

ENV DJANGO_SETTINGS_MODULE=api_gateway.settings

CMD ["sh", "-c", "python3 manage.py runserver 0.0.0.0:8080"]