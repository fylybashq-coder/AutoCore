from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate


class AppointmentRepository:

    @staticmethod
    def create(db: Session, appointment: AppointmentCreate):
        new_appointment = Appointment(
            customer_id=appointment.customer_id,
            vehicle_id=appointment.vehicle_id,
            appointment_date=appointment.appointment_date,
            appointment_time=appointment.appointment_time,
            service_type=appointment.service_type,
            advisor=appointment.advisor,
            notes=appointment.notes,
        )

        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        return new_appointment

    @staticmethod
    def get_all(db: Session):
        return db.query(Appointment).all()

    @staticmethod
    def get_by_customer(db: Session, customer_id: int):
        return (
            db.query(Appointment)
            .filter(Appointment.customer_id == customer_id)
            .all()
        )

    @staticmethod
    def get_by_vehicle(db: Session, vehicle_id: int):
        return (
            db.query(Appointment)
            .filter(Appointment.vehicle_id == vehicle_id)
            .all()
        )

    @staticmethod
    def update(db: Session, appointment_id: int, appointment: AppointmentUpdate):
        db_appointment = (
            db.query(Appointment)
            .filter(Appointment.id == appointment_id)
            .first()
        )

        if not db_appointment:
            return None

        db_appointment.vehicle_id = appointment.vehicle_id
        db_appointment.appointment_date = appointment.appointment_date
        db_appointment.appointment_time = appointment.appointment_time
        db_appointment.service_type = appointment.service_type
        db_appointment.advisor = appointment.advisor
        db_appointment.notes = appointment.notes

        db.commit()
        db.refresh(db_appointment)

        return db_appointment

    @staticmethod
    def delete(db: Session, appointment_id: int):
        appointment = (
            db.query(Appointment)
            .filter(Appointment.id == appointment_id)
            .first()
        )

        if not appointment:
            return False

        db.delete(appointment)
        db.commit()

        return True