from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.models.customer import Customer
from app.models.appointment import Appointment
from app.models.call import Call
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleRepository:

    @staticmethod
    def create(db: Session, vehicle: VehicleCreate):
        new_vehicle = Vehicle(
            customer_id=vehicle.customer_id,
            brand=vehicle.brand,
            model=vehicle.model,
            model_year=vehicle.model_year,
            plate_number=vehicle.plate_number,
            chassis_number=vehicle.chassis_number,
            engine_number=vehicle.engine_number,
            color=vehicle.color,
            transmission=vehicle.transmission,
            fuel_type=vehicle.fuel_type,
            current_km=vehicle.current_km
        )

        db.add(new_vehicle)
        db.commit()
        db.refresh(new_vehicle)

        return new_vehicle

    @staticmethod
    def get_all(db: Session):
        return db.query(Vehicle).all()

    @staticmethod
    def get_by_customer(db: Session, customer_id: int):
        return db.query(Vehicle).filter(
            Vehicle.customer_id == customer_id
        ).all()

    @staticmethod
    def update(db: Session, vehicle_id: int, vehicle_data: VehicleUpdate):
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == vehicle_id
        ).first()

        if not vehicle:
            return None

        vehicle.brand = vehicle_data.brand
        vehicle.model = vehicle_data.model
        vehicle.model_year = vehicle_data.model_year
        vehicle.plate_number = vehicle_data.plate_number
        vehicle.chassis_number = vehicle_data.chassis_number
        vehicle.engine_number = vehicle_data.engine_number
        vehicle.color = vehicle_data.color
        vehicle.transmission = vehicle_data.transmission
        vehicle.fuel_type = vehicle_data.fuel_type
        vehicle.current_km = vehicle_data.current_km

        db.commit()
        db.refresh(vehicle)

        return vehicle

    @staticmethod
    def delete(db: Session, vehicle_id: int):
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == vehicle_id
        ).first()

        if not vehicle:
            return False

        db.delete(vehicle)
        db.commit()

        return True

    @staticmethod
    def get_vehicle_profile(db: Session, vehicle_id: int):
        vehicle = (
            db.query(Vehicle)
            .filter(Vehicle.id == vehicle_id)
            .first()
        )

        if not vehicle:
            return None

        customer = (
            db.query(Customer)
            .filter(Customer.id == vehicle.customer_id)
            .first()
        )

        appointments = (
            db.query(Appointment)
            .filter(Appointment.vehicle_id == vehicle_id)
            .all()
        )

        calls = (
            db.query(Call)
            .filter(Call.vehicle_id == vehicle_id)
            .all()
        )

        return {
            "vehicle": vehicle,
            "customer": customer,
            "appointments": appointments,
            "calls": calls,
        }