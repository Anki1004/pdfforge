import os
import uuid
import subprocess
import tempfile
from pathlib import Path
from fastapi import HTTPException, UploadFile

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


def tmp_dir() -> str:
    """Create and return a unique temp directory path."""
    d = os.path.join(tempfile.gettempdir(), "pdfforge", uuid.uuid4().hex)
    os.makedirs(d, exist_ok=True)
    return d


def cleanup(*paths: str):
    """Silently remove files/directories."""
    for p in paths:
        try:
            if os.path.isdir(p):
                import shutil; shutil.rmtree(p, ignore_errors=True)
            elif os.path.exists(p):
                os.unlink(p)
        except Exception:
            pass


async def save_upload(upload: UploadFile, dest: str):
    """Save an uploaded file to dest, enforcing size limit."""
    content = await upload.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, f"File too large. Max size is {MAX_FILE_SIZE // 1024 // 1024} MB.")
    if not upload.filename or not upload.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted.")
    with open(dest, "wb") as f:
        f.write(content)


def run_cmd(cmd: list[str], timeout: int = 120) -> subprocess.CompletedProcess:
    """Run a subprocess command and raise HTTPException on failure."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        if result.returncode != 0:
            err = (result.stderr or result.stdout or "Unknown error").strip()[:400]
            raise HTTPException(500, f"Command failed: {err}")
        return result
    except subprocess.TimeoutExpired:
        raise HTTPException(504, "Processing timed out. Try a smaller file.")
    except FileNotFoundError as e:
        tool = cmd[0]
        raise HTTPException(503, f"{tool} is not installed on this server. Please contact support.")
