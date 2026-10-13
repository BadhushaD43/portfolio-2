from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.core.config import settings
from app.db.init_db import init_db
from app.routes import auth, projects, uploads, contact, profile

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directory exists and database is initialized with seeds
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Badhusha D - Junior Backend Developer Portfolio with Dynamic Admin Management",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory for persistent static file serving
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers with standard API prefix (/api)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(projects.router, prefix=settings.API_PREFIX)
app.include_router(uploads.router, prefix=settings.API_PREFIX)
app.include_router(contact.router, prefix=settings.API_PREFIX)
app.include_router(profile.router, prefix=settings.API_PREFIX)

# Fallback routes without /api prefix (ensures requests succeed even if /api is omitted)
app.include_router(auth.router, include_in_schema=False)
app.include_router(projects.router, include_in_schema=False)
app.include_router(contact.router, include_in_schema=False)
app.include_router(profile.router, include_in_schema=False)

@app.get("/")
def root():
    return {
        "name": "Badhusha D - Portfolio API",
        "role": "Junior Backend Developer | Java | Full Stack Developer",
        "status": "online",
        "docs_url": "/docs",
        "version": settings.VERSION
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "portfolio-backend"}

@app.get("/health")
def health_check_root():
    return {"status": "healthy", "service": "portfolio-backend"}

