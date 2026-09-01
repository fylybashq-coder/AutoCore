from sqlalchemy.orm import Session

from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.repositories.appointment_repository import AppointmentRepository


class AppointmentService:

    @staticmethod
    def create_appointment(
        db: Session,
        appointment: AppointmentCreate
    ):
        return AppointmentRepository.create(
            db,
            appointment
        )

    @staticmethod
    def get_appointments(db: Session):
        return AppointmentRepository.get_all(db)

    @staticmethod
    def get_customer_appointments(
        db: Session,
        customer_id: int
    ):
        return AppointmentRepository.get_by_customer(
            db,
            customer_id
        )

    @staticmethod
    def get_vehicle_appointments(
        db: Session,
        vehicle_id: int
    ):
        return AppointmentRepository.get_by_vehicle(
            db,
            vehicle_id
        )

    @staticmethod
    def update_appointment(
        db: Session,
        appointment_id: int,
        appointment: AppointmentUpdate
    ):
        return AppointmentRepository.update(
            db,
            appointment_id,
            appointment
        )

    @staticmethod
    def delete_appointment(
        db: Session,
        appointment_id: int
    ):
        return AppointmentRepository.delete(
            db,
            appointment_id
        )