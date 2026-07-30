from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models.attendance import Attendance


def get_today_attendance(db: Session, user_id: int):
    return (
        db.query(Attendance)
        .filter(
            Attendance.user_id == user_id,
            Attendance.check_out == None
        )
        .order_by(Attendance.id.desc())
        .first()
    )

def create_checkin(db: Session, user_id: int):

    attendance = Attendance(
        user_id=user_id,
        date=date.today(),
        check_in=datetime.now()
    )

    db.add(attendance)

    db.commit()

    db.refresh(attendance)

    return attendance


def update_checkout(db: Session, attendance: Attendance):

    attendance.check_out = datetime.now()

    db.commit()

    db.refresh(attendance)

    return attendance