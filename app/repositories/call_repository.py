from sqlalchemy.orm import Session

from app.models.call import Call
from app.schemas.call import CallCreate


class CallRepository:

    @staticmethod
    def create(db: Session, call: CallCreate):
        new_call = Call(
            customer_id=call.customer_id,
            vehicle_id=call.vehicle_id,
            call_type=call.call_type,
            notes=call.notes
        )

        db.add(new_call)
        db.commit()
        db.refresh(new_call)

        return new_call

    @staticmethod
    def get_all(db: Session):
        return db.query(Call).all()

    @staticmethod
    def get_customer_calls(db: Session, customer_id: int):
        return (
            db.query(Call)
            .filter(Call.customer_id == customer_id)
            .all()
        )

    @staticmethod
    def get_vehicle_calls(db: Session, vehicle_id: int):
        return (
            db.query(Call)
            .filter(Call.vehicle_id == vehicle_id)
            .all()
        )