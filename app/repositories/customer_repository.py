from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.customer import Customer
from app.models.vehicle import Vehicle
from app.schemas.customer import CustomerCreate


class CustomerRepository:

    @staticmethod
    def create(db: Session, customer: CustomerCreate):
        new_customer = Customer(
            name=customer.name,
            mobile=customer.mobile,
            email=customer.email
        )

        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)

        return new_customer

    @staticmethod
    def get_all(db: Session):
        rows = (
            db.query(
                Customer.id,
                Customer.name,
                Customer.mobile,
                Customer.email,
                func.count(Vehicle.id).label("vehicle_count")
            )
            .outerjoin(
                Vehicle,
                Customer.id == Vehicle.customer_id
            )
            .group_by(
                Customer.id,
                Customer.name,
                Customer.mobile,
                Customer.email
            )
            .all()
        )

        return [
            {
                "id": row.id,
                "name": row.name,
                "mobile": row.mobile,
                "email": row.email,
                "vehicle_count": row.vehicle_count
            }
            for row in rows
        ]

    @staticmethod
    def get_by_id(db: Session, customer_id: int):
        return (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

    @staticmethod
    def get_by_mobile(db: Session, mobile: str):
        return (
            db.query(Customer)
            .filter(Customer.mobile == mobile)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        customer_id: int,
        customer: CustomerCreate,
    ):
        existing_customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not existing_customer:
            return None

        existing_customer.name = customer.name
        existing_customer.mobile = customer.mobile
        existing_customer.email = customer.email

        db.commit()
        db.refresh(existing_customer)

        return existing_customer

    @staticmethod
    def delete(db: Session, customer_id: int):
        customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not customer:
            return False

        db.delete(customer)
        db.commit()

        return True