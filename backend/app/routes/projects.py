from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import re
from app.db.session import get_db
from app.model.models import Project, User
from app.schema.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from app.core.deps import get_current_admin

router = APIRouter(tags=["Projects"])

def generate_slug(title: str, existing_slug: Optional[str] = None) -> str:
    """Generate a clean URL-friendly slug from title."""
    if existing_slug and existing_slug.strip():
        slug = re.sub(r"[^a-zA-Z0-9_-]", "-", existing_slug.strip().lower())
        return re.sub(r"-+", "-", slug).strip("-")
    slug = re.sub(r"[^a-zA-Z0-9_-]", "-", title.strip().lower())
    return re.sub(r"-+", "-", slug).strip("-")

def format_project(project: Project) -> ProjectOut:
    return ProjectOut(
        id=project.id,
        title=project.title,
        slug=project.slug,
        short_description=project.short_description,
        description=project.description,
        technologies=project.technologies,
        features=project.features,
        thumbnail_url=project.thumbnail_url,
        github_url=project.github_url,
        live_demo_url=project.live_demo_url,
        status=project.status,
        display_order=project.display_order,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )

# --- Public Endpoints ---

@router.get("/projects", response_model=List[ProjectOut])
def get_public_projects(db: Session = Depends(get_db)):
    """Retrieve all published projects for the public portfolio page."""
    projects = (
        db.query(Project)
        .filter(Project.status == "published")
        .order_by(Project.display_order.asc(), Project.created_at.desc())
        .all()
    )
    return [format_project(p) for p in projects]

@router.get("/projects/{slug_or_id}", response_model=ProjectOut)
def get_public_project_detail(slug_or_id: str, db: Session = Depends(get_db)):
    """Retrieve a single published project by slug or ID."""
    project = None
    if slug_or_id.isdigit():
        project = db.query(Project).filter(
            Project.id == int(slug_or_id),
            Project.status == "published"
        ).first()
    
    if not project:
        project = db.query(Project).filter(
            Project.slug == slug_or_id,
            Project.status == "published"
        ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return format_project(project)

# --- Admin Endpoints ---

@router.get("/admin/projects", response_model=List[ProjectOut])
def get_all_projects_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Retrieve all projects (published and drafts) for authorized administrators."""
    projects = (
        db.query(Project)
        .order_by(Project.display_order.asc(), Project.created_at.desc())
        .all()
    )
    return [format_project(p) for p in projects]

@router.post("/admin/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project_admin(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create a new project in the persistent database."""
    base_slug = generate_slug(project_in.title, project_in.slug)
    slug = base_slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    project = Project(
        title=project_in.title.strip(),
        slug=slug,
        short_description=project_in.short_description.strip(),
        description=project_in.description.strip() if project_in.description else "",
        thumbnail_url=project_in.thumbnail_url.strip() if project_in.thumbnail_url else None,
        github_url=project_in.github_url.strip() if project_in.github_url else None,
        live_demo_url=project_in.live_demo_url.strip() if project_in.live_demo_url else None,
        status=project_in.status,
        display_order=project_in.display_order,
    )
    project.technologies = project_in.technologies
    project.features = project_in.features

    db.add(project)
    db.commit()
    db.refresh(project)
    return format_project(project)

@router.put("/admin/projects/{project_id}", response_model=ProjectOut)
def update_project_admin(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update an existing project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project_in.title is not None:
        project.title = project_in.title.strip()
    
    if project_in.slug is not None and project_in.slug.strip():
        new_slug = generate_slug(project.title, project_in.slug)
        existing = db.query(Project).filter(Project.slug == new_slug, Project.id != project_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already in use")
        project.slug = new_slug

    if project_in.short_description is not None:
        project.short_description = project_in.short_description.strip()
    if project_in.description is not None:
        project.description = project_in.description.strip()
    if project_in.technologies is not None:
        project.technologies = project_in.technologies
    if project_in.features is not None:
        project.features = project_in.features
    if project_in.thumbnail_url is not None:
        project.thumbnail_url = project_in.thumbnail_url.strip() if project_in.thumbnail_url else None
    if project_in.github_url is not None:
        project.github_url = project_in.github_url.strip() if project_in.github_url else None
    if project_in.live_demo_url is not None:
        project.live_demo_url = project_in.live_demo_url.strip() if project_in.live_demo_url else None
    if project_in.status is not None:
        if project_in.status not in ("published", "draft"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status must be published or draft")
        project.status = project_in.status
    if project_in.display_order is not None:
        project.display_order = project_in.display_order

    db.commit()
    db.refresh(project)
    return format_project(project)

@router.delete("/admin/projects/{project_id}")
def delete_project_admin(
    project_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete a project after admin confirmation."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"success": True, "message": f"Project '{project.title}' deleted successfully", "id": project_id}

@router.post("/admin/projects/{project_id}/publish", response_model=ProjectOut)
def toggle_publish_project_admin(
    project_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Toggle or update publication status of a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project.status = "draft" if project.status == "published" else "published"
    db.commit()
    db.refresh(project)
    return format_project(project)
