from sqlalchemy.orm import Session

from app.schemas.call import CallCreate
from app.repositories.call_repository import CallRepository


class CallService:

    @staticmethod
    def create_call(db: Session, call: CallCreate):
        return CallRepository.create(db, call)

    @staticmethod
    def get_calls(db: Session):
        return CallRepository.get_all(db)

    @staticmethod
    def get_customer_calls(db: Session, customer_id: int):
        return CallRepository.get_customer_calls(
            db,
            customer_id
        )

    @staticmethod
    def get_vehicle_calls(db: Session, vehicle_id: int):
        return CallRepository.get_vehicle_calls(
            db,
            vehicle_id
        )