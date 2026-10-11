from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
import json
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    
    # Store list of technologies and list of features as serialized JSON strings for full cross-db compatibility (SQLite/MySQL/PostgreSQL)
    _technologies = Column("technologies", Text, default="[]", nullable=False)
    _features = Column("features", Text, default="[]", nullable=False)
    
    thumbnail_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    live_demo_url = Column(String(500), nullable=True)
    status = Column(String(50), default="published", index=True, nullable=False)  # "published" or "draft"
    display_order = Column(Integer, default=0, index=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    @property
    def technologies(self):
        if not self._technologies:
            return []
        try:
            return json.loads(self._technologies)
        except Exception:
            return [t.strip() for t in self._technologies.split(",") if t.strip()]

    @technologies.setter
    def technologies(self, value):
        if isinstance(value, list):
            self._technologies = json.dumps(value)
        elif isinstance(value, str):
            try:
                # test if valid json
                json.loads(value)
                self._technologies = value
            except Exception:
                self._technologies = json.dumps([t.strip() for t in value.split(",") if t.strip()])
        else:
            self._technologies = "[]"

    @property
    def features(self):
        if not self._features:
            return []
        try:
            return json.loads(self._features)
        except Exception:
            return [f.strip() for f in self._features.split("\n") if f.strip()]

    @features.setter
    def features(self, value):
        if isinstance(value, list):
            self._features = json.dumps(value)
        elif isinstance(value, str):
            try:
                json.loads(value)
                self._features = value
            except Exception:
                self._features = json.dumps([f.strip() for f in value.split("\n") if f.strip()])
        else:
            self._features = "[]"

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    source = Column(String(50), default="Homepage", nullable=False)  # "Homepage" or "Contact Page"
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BusinessMessage(Base):
    __tablename__ = "business_messages"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    requirement_type = Column(String(50), nullable=False, index=True)  # WEBSITE, WEB_APPLICATION, OTHER
    other_requirement = Column(Text, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="NEW", nullable=False, index=True)  # NEW, IN_PROGRESS, COMPLETED
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), default="Badhusha D", nullable=False)
    email = Column(String(255), default="badhushad0@gmail.com", nullable=False)
    education = Column(Text, default="Bachelor of Engineering (B.E.) in Computer Science and Engineering - Oxford Engineering College (2020 – 2024)", nullable=False)
    cv_url = Column(String(500), nullable=True)
    cv_filename = Column(String(255), default="Badhusha_Resume.pdf", nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

