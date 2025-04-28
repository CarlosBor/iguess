# Start from a Python base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies (optional, can be minimal)
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies early to leverage caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download Huggingface model now
RUN python -c "\
from transformers import pipeline; \
pipeline('sentiment-analysis')"

# Now copy the actual app code
COPY app.py .

# Expose port
EXPOSE 8000

# Command to run the server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]