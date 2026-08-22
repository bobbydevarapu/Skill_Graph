from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.candidates import router as candidates_router
from app.routes.jobs import router as jobs_router
from app.routes.graph import router as graph_router


app = FastAPI(
    title="SkillGraph",
    description="Developer Skill & Job Intelligence Platform",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://skill-graph-topaz.vercel.app",
        "https://skill-graph-one.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "service": "SkillGraph",
        "status": "online",
        "message": "SkillGraph API is running",
        "docs": "/docs",
        "health": "/api/health",
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "SkillGraph",
    }


# ==========================================
# API ROUTES
# ==========================================

app.include_router(candidates_router)
app.include_router(jobs_router)
app.include_router(graph_router)