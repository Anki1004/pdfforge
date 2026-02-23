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

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
