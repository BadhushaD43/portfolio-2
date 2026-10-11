from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    is_admin: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class PasswordChange(BaseModel):
    current_password: Optional[str] = None
    new_password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    slug: Optional[str] = None
    short_description: str = Field(..., min_length=5)
    description: Optional[str] = None
    technologies: List[str] = []
    features: List[str] = []
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    status: str = Field(default="published", pattern="^(published|draft)$")
    display_order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    features: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    status: Optional[str] = None
    display_order: Optional[int] = None

class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    description: Optional[str] = None
    technologies: List[str] = []
    features: List[str] = []
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    status: str
    display_order: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Contact Schemas ---
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    subject: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)
    source: Optional[str] = Field(default="Homepage", max_length=50)

class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    source: str = "Homepage"
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Business Message Schemas ---
class BusinessMessageCreate(BaseModel):
    business_name: Optional[str] = Field(default=None, alias="businessName")
    businessName: Optional[str] = None
    email: str = Field(..., min_length=5, max_length=255)
    requirement_type: Optional[str] = Field(default=None, alias="requirementType")
    requirementType: Optional[str] = None
    other_requirement: Optional[str] = Field(default=None, alias="otherRequirement")
    otherRequirement: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=5000)

    class Config:
        populate_by_name = True

class BusinessMessageStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(NEW|IN_PROGRESS|COMPLETED)$")

class BusinessMessageOut(BaseModel):
    id: int
    business_name: str
    email: str
    requirement_type: str
    other_requirement: Optional[str] = None
    message: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Pagination / List wrappers ---
class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    limit: int
    total_pages: int

# --- Dashboard Stats Schemas ---
class DashboardStats(BaseModel):
    total_business_messages: int
    new_business_messages: int
    total_social_connect_messages: int
    unread_social_connect_messages: int
    total_projects: int
    published_projects: int
    recent_business_messages: List[BusinessMessageOut] = []
    recent_social_messages: List[ContactOut] = []
    recent_projects: List[ProjectOut] = []

# --- Profile Schemas ---
class ProfileOut(BaseModel):
    id: int
    full_name: str
    email: str
    education: str
    cv_url: Optional[str] = None
    cv_filename: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    education: Optional[str] = None

