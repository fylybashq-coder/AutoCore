from sqlalchemy.orm import Session

from app.schemas.customer import CustomerCreate
from app.repositories.customer_repository import CustomerRepository
from app.services.vehicle_service import VehicleService
from app.services.appointment_service import AppointmentService
from app.services.call_service import CallService


class CustomerService:

    @staticmethod
    def create_customer(db: Session, customer: CustomerCreate):
        return CustomerRepository.create(db, customer)

    @staticmethod
    def get_customers(db: Session):
        return CustomerRepository.get_all(db)

    @staticmethod
    def get_customer_by_id(db: Session, customer_id: int):
        return CustomerRepository.get_by_id(db, customer_id)

    @staticmethod
    def customer_by_mobile(db: Session, mobile: str):
        return CustomerRepository.get_by_mobile(db, mobile)

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: int,
        customer: CustomerCreate,
    ):
        return CustomerRepository.update(
            db,
            customer_id,
            customer,
        )

    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: int,
    ):
        return CustomerRepository.delete(
            db,
            customer_id,
        )

    @staticmethod
    def get_customer_360(db: Session, customer_id: int):
        """Fetches full 360 view for a customer using their ID."""
        customer = CustomerRepository.get_by_id(db, customer_id)

        if not customer:
            return None

        vehicles = VehicleService.get_customer_vehicles(
            db,
            customer.id
        )

        appointments = AppointmentService.get_customer_appointments(
            db,
            customer.id
        )

        calls = CallService.get_customer_calls(
            db,
            customer.id
        )

        return {
            "customer": {
                "id": customer.id,
                "name": customer.name,
                "mobile": customer.mobile,
                "email": customer.email
            },
            "vehicles": vehicles or [],
            "appointments": appointments or [],
            "calls": calls or []
        }