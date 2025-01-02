FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false -d /app appuser

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Set permissions
RUN chown -R appuser:appuser /app

ENV DJANGO_SETTINGS_MODULE=user_service.settings
ENV PYTHONPATH=/app

# Switch to non-root user
USER appuser

CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py populate_data && python3 manage.py runserver 0.0.0.0:8000 & python3 protos/server.py & python3 ./users/consumer.py"]  