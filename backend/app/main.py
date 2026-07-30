from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers.attendance import router as attendance_router
# Import models
from app.models.user import User
from app.models.attendance import Attendance
from app.models.embedding import FaceEmbedding
from app.routers.face import router as face_router
# Import routers
from app.routers.auth import router as auth_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Face Attendance API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(face_router)
app.include_router(attendance_router)
@app.get("/")
def root():
    return {
        "message": "Face Attendance API Running 🚀"
    }