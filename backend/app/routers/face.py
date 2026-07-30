from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.embedding import FaceEmbedding
from app.models.user import User
from app.services.face_service import (
    cosine_similarity,
    get_embedding,
    average_embeddings
)
from app.utils import get_current_user

router = APIRouter(
    prefix="/face",
    tags=["Face Recognition"]
)


@router.post("/register")
async def register_face(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if len(files) < 5:
        raise HTTPException(
            status_code=400,
            detail="Upload at least 5 images."
        )

    embeddings = []

    for file in files:

        image_bytes = await file.read()

        embedding = get_embedding(image_bytes)

        if embedding is None:
            continue

        embeddings.append(embedding)

    if len(embeddings) < 3:
        raise HTTPException(
            status_code=400,
            detail="Face not detected in enough images."
        )

    final_embedding = average_embeddings(embeddings)

    existing = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).first()

    if existing:
        existing.embedding = final_embedding

    else:
        face = FaceEmbedding(
            user_id=current_user.id,
            embedding=final_embedding
        )

        db.add(face)

    db.commit()

    return {
        "message": "Face Registered Successfully"
    }
    
@router.post("/verify")
async def verify_face(
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
            detail="Face not registered."
        )

    image = await file.read()

    embedding = get_embedding(image)

    if embedding is None:
        raise HTTPException(
            status_code=400,
            detail="No face detected."
        )

    similarity = cosine_similarity(
        embedding,
        stored.embedding
    )

    if similarity > 0.60:

        return {
            "verified": True,
            "similarity": float(similarity)
        }

    return {
        "verified": False,
        "similarity": float(similarity)
    }