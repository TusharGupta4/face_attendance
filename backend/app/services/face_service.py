import cv2
import numpy as np
from insightface.app import FaceAnalysis

face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0)

FACE_MATCH_THRESHOLD = 0.65


def get_embedding(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    faces = face_app.get(image)

    if len(faces) == 0:
        return None

    return faces[0].embedding


def average_embeddings(embeddings):
    avg = np.mean(embeddings, axis=0)
    avg = avg / np.linalg.norm(avg)
    return avg.tolist()


def cosine_similarity(embedding1, embedding2):
    embedding1 = np.array(embedding1)
    embedding2 = np.array(embedding2)

    return np.dot(
        embedding1,
        embedding2
    ) / (
        np.linalg.norm(embedding1)
        * np.linalg.norm(embedding2)
    )


def verify_embedding(live_embedding, stored_embedding):
    similarity = cosine_similarity(
        live_embedding,
        stored_embedding
    )

    return similarity >= FACE_MATCH_THRESHOLD, float(similarity)