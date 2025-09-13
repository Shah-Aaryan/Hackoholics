# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router

# Create FastAPI app
app = FastAPI(
    title="Energy Recommendation API (MongoDB)",
    version="1.0.0",
    description="AI-powered energy recommendations for households"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Energy Recommendation API",
        "version": "1.0.0",
        "database": "MongoDB",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "database": "MongoDB"
    }