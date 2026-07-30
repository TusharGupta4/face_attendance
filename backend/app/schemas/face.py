from pydantic import BaseModel


class FaceRegisterResponse(BaseModel):
    message: str