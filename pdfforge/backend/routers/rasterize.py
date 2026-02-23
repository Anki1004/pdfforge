import os
import glob
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from utils.pdf_utils import tmp_dir, cleanup, save_upload, run_cmd

router = APIRouter(tags=["rasterize"])


@router.post("/rasterize")
async def rasterize_pdf(
    file: UploadFile = File(...),
    dpi: int = Form(144),
):
    """Rasterize a PDF to images then rebuild as PDF — removes all watermarks."""
    if dpi not in (72, 144, 216, 300):
        dpi = 144

    work    = tmp_dir()
    src     = os.path.join(work, "input.pdf")
    img_dir = os.path.join(work, "pages")
    dst     = os.path.join(work, "rasterized.pdf")
    os.makedirs(img_dir, exist_ok=True)

    try:
        await save_upload(file, src)

        # Step 1: Render each page to a JPEG image via Ghostscript
        run_cmd([
            "gs",
            "-dBATCH",
            "-dNOPAUSE",
            "-dQUIET",
            "-sDEVICE=jpeg",
            f"-r{dpi}",
            "-dJPEGQ=88",
            f"-sOutputFile={img_dir}/page_%04d.jpg",
            src,
        ], timeout=180)

        pages = sorted(glob.glob(os.path.join(img_dir, "*.jpg")))
        if not pages:
            raise HTTPException(500, "No pages were rendered. The PDF may be corrupt or encrypted.")

        # Step 2: Reassemble images back into a PDF using Ghostscript
        run_cmd(
            ["gs", "-dBATCH", "-dNOPAUSE", "-dQUIET",
             "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
             f"-sOutputFile={dst}"] + pages,
            timeout=120,
        )

        return FileResponse(
            dst,
            media_type="application/pdf",
            filename="watermark-removed.pdf",
            headers={"X-Method": "rasterize", "X-DPI": str(dpi)},
        )
    finally:
        pass
