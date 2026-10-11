from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.model.models import User
from app.core.deps import get_current_admin
from app.core.config import settings
import os
import uuid
import shutil

router = APIRouter(prefix="/admin/uploads", tags=["Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_project_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    """Securely upload a project thumbnail/image, save to disk, and return persistent public URL."""
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )

    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Check content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image"
        )

    # Generate safe unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 5 MB"
        )

    # Write file to disk
    with open(target_path, "wb") as f:
        f.write(contents)

    # Public URL accessible through static files mount
    public_url = f"/uploads/{unique_filename}"

    return {
        "success": True,
        "filename": unique_filename,
        "url": public_url,
        "original_filename": file.filename,
        "size": len(contents)
    }
