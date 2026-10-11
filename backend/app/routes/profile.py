from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.model.models import User, Profile
from app.schema.schemas import ProfileOut, ProfileUpdate
from app.core.deps import get_current_admin
from app.core.config import settings
import os
import uuid
import mimetypes

router = APIRouter(tags=["Profile"])

ALLOWED_CV_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_CV_SIZE = 15 * 1024 * 1024  # 15 MB

def get_or_create_profile(db: Session) -> Profile:
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(
            full_name="Badhusha D",
            email="badhushad0@gmail.com",
            education="Bachelor of Engineering (B.E.) in Computer Science and Engineering - Oxford Engineering College (2020 – 2024)",
            cv_url="/Badhusha_Resume.pdf",
            cv_filename="Badhusha_Resume.pdf"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

# --- Public Profile Details ---
@router.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    """Fetch current portfolio owner profile details and active CV file info."""
    return get_or_create_profile(db)

# --- Public CV Download Route ---
@router.api_route("/profile/cv/download", methods=["GET", "HEAD"])
def download_cv(db: Session = Depends(get_db)):
    """
    Download the latest active CV uploaded by admin.
    Automatically serves the newest file, or falls back to default resume if no custom upload exists.
    """
    profile = get_or_create_profile(db)
    
    # 1. If custom CV has been uploaded to uploads directory
    if profile.cv_url and profile.cv_url.startswith("/uploads/"):
        filename = profile.cv_url.replace("/uploads/", "").lstrip("/\\")
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            media_type, _ = mimetypes.guess_type(file_path)
            download_filename = profile.cv_filename or os.path.basename(file_path)
            return FileResponse(
                path=file_path,
                filename=download_filename,
                media_type=media_type or "application/octet-stream",
                headers={
                    "Content-Disposition": f'attachment; filename="{download_filename}"'
                }
            )

    # 2. Check public directory default resume
    public_resume_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "public", "Badhusha_Resume.pdf")
    )
    if os.path.exists(public_resume_path):
        return FileResponse(
            path=public_resume_path,
            filename="Badhusha_D_CV.pdf",
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="Badhusha_D_CV.pdf"'
            }
        )

    # 3. Fallback redirect if static file is served by web server
    return RedirectResponse(url=profile.cv_url or "/Badhusha_Resume.pdf")

# --- Admin Profile Update ---
@router.put("/admin/profile", response_model=ProfileOut)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update profile details (name, email, education). Admin only."""
    profile = get_or_create_profile(db)

    if profile_in.full_name is not None and profile_in.full_name.strip():
        profile.full_name = profile_in.full_name.strip()
    if profile_in.email is not None and profile_in.email.strip():
        profile.email = profile_in.email.strip()
    if profile_in.education is not None and profile_in.education.strip():
        profile.education = profile_in.education.strip()

    db.commit()
    db.refresh(profile)
    return profile

# --- Admin CV Upload ---
@router.post("/admin/profile/cv", response_model=ProfileOut)
async def upload_cv_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Upload a new CV file (.pdf, .doc, .docx).
    Once uploaded, all website download buttons automatically serve this file immediately.
    """
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload"
        )

    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_CV_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_CV_EXTENSIONS)}"
        )

    contents = await file.read()
    if len(contents) > MAX_CV_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File exceeds maximum allowed size of 15 MB"
        )

    # Clean unique filename preserving original extension
    clean_original = "".join(c for c in file.filename if c.isalnum() or c in ("-", "_", "."))
    unique_filename = f"cv_{uuid.uuid4().hex[:10]}_{clean_original}"
    target_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(target_path, "wb") as f:
        f.write(contents)

    profile = get_or_create_profile(db)
    profile.cv_url = f"/uploads/{unique_filename}"
    profile.cv_filename = file.filename

    db.commit()
    db.refresh(profile)
    return profile
