from sqlalchemy.orm import Session

from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.repositories.vehicle_repository import VehicleRepository


class VehicleService:

    @staticmethod
    def create_vehicle(db: Session, vehicle: VehicleCreate):
        return VehicleRepository.create(db, vehicle)

    @staticmethod
    def get_vehicles(db: Session):
        return VehicleRepository.get_all(db)

    @staticmethod
    def get_customer_vehicles(db: Session, customer_id: int):
        return VehicleRepository.get_by_customer(db, customer_id)

    @staticmethod
    def update_vehicle(db: Session, vehicle_id: int, vehicle: VehicleUpdate):
        return VehicleRepository.update(db, vehicle_id, vehicle)

    @staticmethod
    def delete_vehicle(db: Session, vehicle_id: int):
        return VehicleRepository.delete(db, vehicle_id)

    @staticmethod
    def get_vehicle_profile(db: Session, vehicle_id: int):
        return VehicleRepository.get_vehicle_profile(db, vehicle_id)