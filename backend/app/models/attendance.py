from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    date = Column(Date, nullable=False)

    check_in = Column(DateTime, nullable=True)

    check_out = Column(DateTime, nullable=True)

    user = relationship("User")