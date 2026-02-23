import os
import uuid
import shutil
import tempfile
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import compress, protect, unlock, rasterize

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://pdfforge.app,https://www.pdfforge.app"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Check dependencies on startup
    print("🚀 PDFForge backend starting…")
    _check_deps()
    yield
    print("👋 Backend shutdown")


def _check_deps():
    import subprocess
    for cmd, name in [
        (["gswin64c", "--version"],   "Ghostscript"),
        (["qpdf", "--version"], "qpdf"),
    ]:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            print(f"  ✅ {name}: {r.stdout.strip()[:40]}")
        except Exception as e:
            print(f"  ⚠️  {name} not found: {e}")


app = FastAPI(
    title="PDFForge API",
    version="1.0.0",
    description="Backend PDF processing API using Ghostscript and qpdf",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────────────────────
app.include_router(compress.router,   prefix="/api")
app.include_router(protect.router,    prefix="/api")
app.include_router(unlock.router,     prefix="/api")
app.include_router(rasterize.router,  prefix="/api")


# ─── Health ─────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "pdfforge-api"}


# ─── 404 catch-all ──────────────────────────────────────────────────────────
@app.exception_handler(404)
async def not_found(req, exc):
    return JSONResponse({"detail": "Not found"}, status_code=404)


import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
