from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
import math
import re

from app.db.session import get_db
from app.model.models import BusinessMessage, ContactMessage, Project, User
from app.schema.schemas import (
    BusinessMessageCreate,
    BusinessMessageOut,
    BusinessMessageStatusUpdate,
    ContactCreate,
    ContactOut,
    DashboardStats,
)
from app.core.deps import get_current_admin

router = APIRouter(tags=["Contact & Business Inquiries"])

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Normalized mapping for requirement types
REQUIREMENT_MAP = {
    "WEBSITE": "WEBSITE",
    "WEB_APPLICATION": "WEB_APPLICATION",
    "OTHER": "OTHER",
    "OTHERS": "OTHER",
    "WEB APPLICATION": "WEB_APPLICATION",
}

# -------------------------------------------------------------
# Public Endpoints
# -------------------------------------------------------------

@router.post("/contact", status_code=status.HTTP_201_CREATED)
def submit_contact_message(message_in: ContactCreate, db: Session = Depends(get_db)):
    """Accept and persist a Social Connect contact form message from Homepage or Contact Page."""
    name = message_in.name.strip()
    email = message_in.email.strip().lower()
    subject = message_in.subject.strip() if message_in.subject else None
    message = message_in.message.strip()
    source = (message_in.source or "Homepage").strip()

    if not name or len(name) < 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name must be at least 2 characters.")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please enter a valid email address.")
    if not message or len(message) < 10:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message must be at least 10 characters.")

    contact_msg = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message,
        source=source,
    )
    db.add(contact_msg)
    db.commit()
    db.refresh(contact_msg)

    return {
        "success": True,
        "message": "Thank you! Your message has been sent successfully. I will get back to you promptly.",
        "id": contact_msg.id,
    }


@router.post("/business-messages", status_code=status.HTTP_201_CREATED)
def submit_business_message(payload: BusinessMessageCreate, db: Session = Depends(get_db)):
    """
    Dedicated endpoint for Business Chat inquiries.
    Supports both camelCase and snake_case inputs with strict server-side validation.
    """
    business_name = (payload.business_name or payload.businessName or "").strip()
    email = payload.email.strip().lower()
    raw_req = (payload.requirement_type or payload.requirementType or "").strip().upper()
    other_req = (payload.other_requirement or payload.otherRequirement or "").strip()
    message = payload.message.strip()

    # Validation
    if not business_name or len(business_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business name is required and must be at least 2 characters."
        )
    if len(business_name) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business name cannot exceed 255 characters."
        )

    if not EMAIL_REGEX.match(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid business email address is required."
        )

    req_normalized = REQUIREMENT_MAP.get(raw_req)
    if not req_normalized:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid requirement type. Allowed options: Website, Web Application, Others."
        )

    if req_normalized == "OTHER":
        if not other_req or len(other_req) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please specify your requirements when 'Others' is selected."
            )
    else:
        # Clear other requirement if not OTHER
        other_req = None

    if not message or len(message) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message must be at least 10 characters."
        )
    if len(message) > 5000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot exceed 5000 characters."
        )

    b_msg = BusinessMessage(
        business_name=business_name,
        email=email,
        requirement_type=req_normalized,
        other_requirement=other_req if req_normalized == "OTHER" else None,
        message=message,
        status="NEW",
    )
    db.add(b_msg)
    db.commit()
    db.refresh(b_msg)

    return {
        "success": True,
        "message": "Thank you! Your business inquiry has been recorded successfully. We will get in touch with you shortly.",
        "id": b_msg.id,
    }


# -------------------------------------------------------------
# Admin Protected Endpoints: Dashboard Aggregation
# -------------------------------------------------------------

@router.get("/admin/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Provide real aggregated statistics and recent records for the Admin Dashboard."""
    total_business = db.query(BusinessMessage).count()
    new_business = db.query(BusinessMessage).filter(BusinessMessage.status == "NEW").count()

    total_social = db.query(ContactMessage).count()
    unread_social = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()

    total_projects = db.query(Project).count()
    published_projects = db.query(Project).filter(Project.status == "published").count()

    recent_business = (
        db.query(BusinessMessage)
        .order_by(BusinessMessage.created_at.desc())
        .limit(5)
        .all()
    )

    recent_social = (
        db.query(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .limit(5)
        .all()
    )

    recent_projects_raw = (
        db.query(Project)
        .order_by(Project.created_at.desc())
        .limit(5)
        .all()
    )

    # Format projects with technology and feature arrays
    recent_projects = []
    for p in recent_projects_raw:
        recent_projects.append({
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "short_description": p.short_description,
            "description": p.description,
            "technologies": p.technologies,
            "features": p.features,
            "thumbnail_url": p.thumbnail_url,
            "github_url": p.github_url,
            "live_demo_url": p.live_demo_url,
            "status": p.status,
            "display_order": p.display_order,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
        })

    return {
        "total_business_messages": total_business,
        "new_business_messages": new_business,
        "total_social_connect_messages": total_social,
        "unread_social_connect_messages": unread_social,
        "total_projects": total_projects,
        "published_projects": published_projects,
        "recent_business_messages": recent_business,
        "recent_social_messages": recent_social,
        "recent_projects": recent_projects,
    }


# -------------------------------------------------------------
# Admin Protected Endpoints: Business Messages Management
# -------------------------------------------------------------

@router.get("/admin/business-messages")
def get_business_messages_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    requirement_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve paginated, searchable, filterable business messages."""
    query = db.query(BusinessMessage)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                BusinessMessage.business_name.ilike(term),
                BusinessMessage.email.ilike(term),
                BusinessMessage.message.ilike(term),
            )
        )

    if requirement_type and requirement_type.strip() and requirement_type != "ALL":
        req_norm = REQUIREMENT_MAP.get(requirement_type.strip().upper(), requirement_type.strip().upper())
        query = query.filter(BusinessMessage.requirement_type == req_norm)

    if status_filter and status_filter.strip() and status_filter != "ALL":
        query = query.filter(BusinessMessage.status == status_filter.strip().upper())

    # Sorting
    sort_column = BusinessMessage.created_at
    if sort_by == "business_name":
        sort_column = BusinessMessage.business_name
    elif sort_by == "status":
        sort_column = BusinessMessage.status

    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()
    total_pages = math.ceil(total / limit) if total > 0 else 1
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": [
            {
                "id": m.id,
                "business_name": m.business_name,
                "email": m.email,
                "requirement_type": m.requirement_type,
                "other_requirement": m.other_requirement,
                "message": m.message,
                "status": m.status,
                "created_at": m.created_at,
                "updated_at": m.updated_at,
            }
            for m in items
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


@router.get("/admin/business-messages/{message_id}", response_model=BusinessMessageOut)
def get_business_message_detail(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Get single business message by ID."""
    msg = db.query(BusinessMessage).filter(BusinessMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business inquiry not found.")
    return msg


@router.patch("/admin/business-messages/{message_id}/status")
def update_business_message_status(
    message_id: int,
    status_in: BusinessMessageStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update status of a business inquiry (NEW, IN_PROGRESS, COMPLETED)."""
    msg = db.query(BusinessMessage).filter(BusinessMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business inquiry not found.")

    msg.status = status_in.status
    db.commit()
    db.refresh(msg)
    return {
        "success": True,
        "id": msg.id,
        "status": msg.status,
        "message": f"Inquiry status updated to {msg.status}."
    }


@router.delete("/admin/business-messages/{message_id}")
def delete_business_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Delete a business message after authorization."""
    msg = db.query(BusinessMessage).filter(BusinessMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business inquiry not found.")

    db.delete(msg)
    db.commit()
    return {"success": True, "message": "Business inquiry deleted successfully.", "id": message_id}


# -------------------------------------------------------------
# Admin Protected Endpoints: Social Connect Management
# -------------------------------------------------------------

@router.get("/admin/social-connect")
def get_social_connect_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),  # 'read', 'unread'
    order: str = Query("desc"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Paginated, searchable, filterable list of Social Connect messages from Homepage & Contact Page."""
    query = db.query(ContactMessage)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ContactMessage.name.ilike(term),
                ContactMessage.email.ilike(term),
                ContactMessage.subject.ilike(term),
                ContactMessage.message.ilike(term),
            )
        )

    if source and source.strip() and source != "ALL":
        query = query.filter(ContactMessage.source.ilike(source.strip()))

    if status_filter == "read":
        query = query.filter(ContactMessage.is_read == True)
    elif status_filter == "unread":
        query = query.filter(ContactMessage.is_read == False)

    if order.lower() == "asc":
        query = query.order_by(asc(ContactMessage.created_at))
    else:
        query = query.order_by(desc(ContactMessage.created_at))

    total = query.count()
    total_pages = math.ceil(total / limit) if total > 0 else 1
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "message": m.message,
                "source": m.source,
                "is_read": m.is_read,
                "created_at": m.created_at,
            }
            for m in items
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


@router.get("/admin/social-connect/{message_id}", response_model=ContactOut)
def get_social_connect_detail(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Get single Social Connect message by ID."""
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found.")
    return msg


@router.patch("/admin/social-connect/{message_id}/read")
def mark_social_connect_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Mark a social connect message as read."""
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found.")
    msg.is_read = True
    db.commit()
    return {"success": True, "id": message_id, "is_read": True}


@router.delete("/admin/social-connect/{message_id}")
def delete_social_connect(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Safely delete a social connect message."""
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found.")
    db.delete(msg)
    db.commit()
    return {"success": True, "message": "Message deleted successfully.", "id": message_id}


# Backward-compatibility alias for existing admin endpoints
@router.get("/admin/messages", response_model=List[ContactOut])
def get_legacy_contact_messages(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.patch("/admin/messages/{message_id}/read")
def mark_legacy_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return mark_social_connect_read(message_id, db, admin)
