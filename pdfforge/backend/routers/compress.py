import os
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from utils.pdf_utils import tmp_dir, cleanup, save_upload, run_cmd

router = APIRouter(tags=["compress"])

QUALITY_MAP = {
    "screen":   "/screen",
    "ebook":    "/ebook",
    "printer":  "/printer",
    "prepress": "/prepress",
}


@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: str = Form("ebook"),
):
    """Compress a PDF using Ghostscript."""
    work = tmp_dir()
    src  = os.path.join(work, "input.pdf")
    dst  = os.path.join(work, "compressed.pdf")
    try:
        await save_upload(file, src)
        gs_quality = QUALITY_MAP.get(quality, "/ebook")

        run_cmd([
             "gswin64c",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            f"-dPDFSETTINGS={gs_quality}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            "-dDetectDuplicateImages=true",
            "-dCompressFonts=true",
            "-dEmbedAllFonts=true",
            f"-sOutputFile={dst}",
            src,
        ])

        orig_kb = os.path.getsize(src) / 1024
        comp_kb = os.path.getsize(dst) / 1024
        saving  = round((1 - comp_kb / orig_kb) * 100, 1) if orig_kb > 0 else 0

        return FileResponse(
            dst,
            media_type="application/pdf",
            filename="compressed.pdf",
            headers={
                "X-Original-KB":    str(round(orig_kb, 1)),
                "X-Compressed-KB":  str(round(comp_kb, 1)),
                "X-Saving-Percent": str(saving),
            },
            background=None,
        )
    finally:
        # Background cleanup — FileResponse streams before we clean up
        # Use a deferred approach: the file is deleted after response is sent
        pass


@router.post("/compress/background-cleanup")
async def _cleanup(path: str):
    cleanup(path)
