import json

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.embedding import FaceEmbedding
from app.services.face_service import (
    get_embedding,
    cosine_similarity,
    verify_embedding
)
from app.services.attendance_service import (
    get_today_attendance,
    create_checkin,
    update_checkout
)
from app.utils import get_current_user
from app.models.attendance import Attendance
from app.models import embedding


FACE_MATCH_THRESHOLD = 0.65

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/checkin")
async def checkin(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    stored = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).first()

    if stored is None:
        raise HTTPException(
            status_code=404,
            detail="Please register your face first."
        )

    image_bytes = await file.read()

    embedding = get_embedding(image_bytes)

    if embedding is None:
        raise HTTPException(
            status_code=400,
            detail="No face detected."
        )

    stored_embedding = stored.embedding

    if isinstance(stored_embedding, str):
        stored_embedding = json.loads(stored_embedding)

    verified, similarity = verify_embedding(
        embedding,
        stored_embedding
    )
    
    if not verified:
            raise HTTPException(
                status_code=401,
                detail="Face verification failed."
            )
    

    attendance = db.query(Attendance).filter(
        Attendance.user_id == current_user.id,
        Attendance.check_out == None
    ).first()
    
    if attendance:
        raise HTTPException(
            status_code=400,
            detail="You are already checked in."
        )

    attendance = create_checkin(
        db,
        current_user.id
    )
    
    
    return {
        "message": "Check-in successful",
        "time": attendance.check_in,
        "similarity": float(similarity)
    }
    
@router.post("/checkout")
async def checkout(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stored = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).first()

    if stored is None:
        raise HTTPException(
            status_code=404,
            detail="Please register your face first."
        )

    image_bytes = await file.read()

    embedding = get_embedding(image_bytes)

    if embedding is None:
        raise HTTPException(
            status_code=400,
            detail="No face detected."
        )

    stored_embedding = stored.embedding

    if isinstance(stored_embedding, str):
        stored_embedding = json.loads(stored_embedding)

    verified, similarity = verify_embedding(
        embedding,
        stored_embedding
    )

    if not verified:
        raise HTTPException(
            status_code=401,
            detail="Face verification failed."
        )

    attendance = get_today_attendance(
        db,
        current_user.id
    )

    if attendance is None:
        raise HTTPException(
            status_code=400,
            detail="You haven't checked in today."
        )

    if attendance.check_out:
        raise HTTPException(
            status_code=400,
            detail="Already checked out."
        )

    attendance = update_checkout(
        db,
        attendance
    )

    return {
        "message": "Check-out successful",
        "time": attendance.check_out,
        "similarity": similarity
    }
    
@router.get("/history")
def attendance_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    attendance = db.query(Attendance).filter(
        Attendance.user_id == current_user.id
    ).order_by(
        Attendance.date.desc()
    ).all()

    return attendance