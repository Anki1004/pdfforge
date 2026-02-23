import os
import platform
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
    work = tmp_dir()
    src  = os.path.join(work, "input.pdf")
    dst  = os.path.join(work, "compressed.pdf")

    try:
        await save_upload(file, src)
        gs_quality = QUALITY_MAP.get(quality, "/ebook")

        import platform
        gs_command = "gswin64c" if platform.system() == "Windows" else "gs"

        run_cmd([
            gs_command,
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

        return FileResponse(
            dst,
            media_type="application/pdf",
            filename="compressed.pdf",
        )

    finally:
        pass

@router.post("/compress/background-cleanup")
async def _cleanup(path: str):
    cleanup(path)
