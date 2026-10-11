from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.model.models import User, Project, Profile
from app.core.security import hash_password
from app.core.config import settings

def init_db():
    """Create all tables and seed initial admin and projects if not already present."""
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Seed Admin User
        admin_email = settings.ADMIN_EMAIL.strip().lower()
        existing_admin = db.query(User).filter(User.email.ilike(admin_email)).first()
        if not existing_admin:
            hashed_pwd = hash_password(settings.ADMIN_PASSWORD)
            new_admin = User(
                email=admin_email,
                hashed_password=hashed_pwd,
                is_admin=True
            )
            db.add(new_admin)
            db.commit()
            pass

        # 2. Seed Initial Projects from Resume
        initial_projects = [
            {
                "title": "Multi-Portal CRM System",
                "slug": "multi-portal-crm-system",
                "short_description": "A role-based CRM system consisting of 10 interconnected portals operating within a unified workflow architecture.",
                "description": "Architected and engineered a comprehensive role-based CRM platform comprising 10 interconnected departmental portals operating under a unified workflow pipeline. Designed the system with a centralized CEO portal for company-wide initialization, role-specific employee dashboards, stage-by-stage progressive workflows, tiered department-head approvals, customer feedback verification loops, and real-time executive progress monitoring.",
                "technologies": ["React.js", "FastAPI", "PostgreSQL", "MySQL"],
                "features": [
                    "CEO portal for initializing system data and creating employee accounts",
                    "Separate role-based portals for employees",
                    "Individual employee dashboards with role-specific access",
                    "Stage-by-stage workflow management",
                    "Employee and department-head approvals before workflow progression",
                    "Final customer feedback stage",
                    "CEO-level monitoring of workflow completion and progress",
                    "Maintenance and feature updates across all 10 portals"
                ],
                "status": "published",
                "display_order": 1,
                "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
            },
            {
                "title": "OTT Movie Discovery Platform",
                "slug": "ott-movie-discovery-platform",
                "short_description": "A full-stack OTT movie discovery application that allows users to discover and browse movies based on their preferred language.",
                "description": "Full-stack OTT movie discovery and streaming web application enabling users to effortlessly browse, search, and discover movies tailored to their language preferences. Integrates third-party cinema APIs for rich metadata, high-resolution media posters, genre filters, and rating scores. Features user profile management, interactive personal watchlists with real-time add/remove functionality, and a dedicated user support request module for regionally requested cinema.",
                "technologies": ["React.js", "FastAPI", "MySQL"],
                "features": [
                    "Language-based movie discovery",
                    "Movie information, genres, ratings, posters, and release details",
                    "External movie API integration",
                    "User account and profile management",
                    "Personal watchlist with add, view, and remove functionality",
                    "User support/request functionality for unavailable movies or preferred-language content"
                ],
                "status": "published",
                "display_order": 2,
                "thumbnail_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80"
            },
            {
                "title": "Employee Attendance Management System",
                "slug": "employee-attendance-management-system",
                "short_description": "A web-based application for employee management, attendance tracking, and reporting.",
                "description": "A robust workforce management and attendance analytics web application built for seamless employee records administration. Implements departmental categorization, daily attendance tracking (Present, Half Day, Leave), bulk spreadsheet data ingestion via Excel/CSV parser, dynamic executive dashboards with workforce statistics, date-range filtering, and automated Excel export generation.",
                "technologies": ["React.js", "FastAPI", "PostgreSQL"],
                "features": [
                    "Employee records and department assignment",
                    "Employee search, editing, and record management",
                    "Daily attendance statuses: Present, Half Day, and Leave",
                    "Excel/CSV-based attendance data uploads",
                    "Dashboard with employee counts, leave information, and attendance statistics",
                    "Date-based and date-range reporting",
                    "Employee search and filtering",
                    "Excel report generation"
                ],
                "status": "published",
                "display_order": 3,
                "thumbnail_url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
            }
        ]

        for p_data in initial_projects:
            existing = db.query(Project).filter(
                (Project.slug == p_data["slug"]) | (Project.title == p_data["title"])
            ).first()
            if not existing:
                proj = Project(
                    title=p_data["title"],
                    slug=p_data["slug"],
                    short_description=p_data["short_description"],
                    description=p_data["description"],
                    thumbnail_url=p_data.get("thumbnail_url"),
                    status=p_data["status"],
                    display_order=p_data["display_order"],
                )
                proj.technologies = p_data["technologies"]
                proj.features = p_data["features"]
                db.add(proj)
                pass

        # 3. Seed Initial Profile
        existing_profile = db.query(Profile).first()
        if not existing_profile:
            initial_profile = Profile(
                full_name="Badhusha D",
                email="badhushad0@gmail.com",
                education="Bachelor of Engineering (B.E.) in Computer Science and Engineering - Oxford Engineering College (2020 – 2024)",
                cv_url="/Badhusha_Resume.pdf",
                cv_filename="Badhusha_Resume.pdf"
            )
            db.add(initial_profile)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[INIT DB] Error during initialization: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
