import os
import uuid
import shutil
import tempfile
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import compress, protect, unlock, rasterize


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 PDFForge backend starting…")
    yield
    print("👋 Backend shutdown")


app = FastAPI(
    title="PDFForge API",
    version="1.0.0",
    lifespan=lifespan,
)

# ✅ ADD CORS AFTER app is created
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporary
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(compress.router, prefix="/api")
app.include_router(protect.router, prefix="/api")
app.include_router(unlock.router, prefix="/api")
app.include_router(rasterize.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.exception_handler(404)
async def not_found(req, exc):
    return JSONResponse({"detail": "Not found"}, status_code=404)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
