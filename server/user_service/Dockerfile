FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

ENV DJANGO_SETTINGS_MODULE=user_service.settings

ENV PYTHONPATH=/app

CMD ["sh", "-c", "python3 manage.py runserver 0.0.0.0:8000 & python3 grpc_services/grpc_server.py"]