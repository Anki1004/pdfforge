import os
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from utils.pdf_utils import tmp_dir, cleanup, save_upload, run_cmd

router = APIRouter(tags=["protect"])


@router.post("/protect")
async def protect_pdf(
    file: UploadFile = File(...),
    user_password:  str = Form(...),
    owner_password: str = Form(""),
):
    """Add AES-256 password protection using qpdf."""
    if not user_password:
        from fastapi import HTTPException
        raise HTTPException(400, "user_password is required.")

    work = tmp_dir()
    src  = os.path.join(work, "input.pdf")
    dst  = os.path.join(work, "protected.pdf")

    try:
        await save_upload(file, src)
        owner = owner_password or (user_password + "_owner")

        run_cmd([
            "qpdf",
            "--encrypt",
            user_password,   # user password
            owner,           # owner password
            "256",           # AES-256
            "--",            # end of encrypt options
            src,
            dst,
        ])

        return FileResponse(
            dst,
            media_type="application/pdf",
            filename="protected.pdf",
        )
    finally:
        pass
