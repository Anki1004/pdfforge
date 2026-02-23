# ── Stage 1: base image with system deps ────────────────────────────────────
FROM python:3.12-slim

LABEL maintainer="PDFForge"
LABEL description="PDFForge FastAPI backend with Ghostscript and qpdf"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

# Verify installs
RUN gs  --version && echo "✅ Ghostscript OK" \
 && qpdf --version && echo "✅ qpdf OK"

# Create app user (non-root for security)
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Create temp directory with correct permissions
RUN mkdir -p /tmp/pdfforge && chown appuser:appuser /tmp/pdfforge

USER appuser

EXPOSE 8080

# Health check


CMD ["python", "main.py"]
