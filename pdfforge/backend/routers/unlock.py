import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from utils.pdf_utils import tmp_dir, cleanup, save_upload, run_cmd

router = APIRouter(tags=["unlock"])


@router.post("/unlock")
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(""),
):
    """Remove password protection from a PDF using qpdf."""
    work = tmp_dir()
    src  = os.path.join(work, "input.pdf")
    dst  = os.path.join(work, "unlocked.pdf")

    try:
        await save_upload(file, src)

        cmd = ["qpdf", "--decrypt"]
        if password:
            cmd += [f"--password={password}"]
        cmd += [src, dst]

        try:
            run_cmd(cmd)
        except HTTPException as e:
            if "password" in str(e.detail).lower() or "encrypt" in str(e.detail).lower():
                raise HTTPException(400, "Wrong password or PDF cannot be decrypted with the provided credentials.")
            raise

        return FileResponse(
            dst,
            media_type="application/pdf",
            filename="unlocked.pdf",
        )
    finally:
        pass
