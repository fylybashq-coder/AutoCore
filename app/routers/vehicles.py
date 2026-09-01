from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.services.vehicle_service import VehicleService

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


@router.post("/")
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    new_vehicle = VehicleService.create_vehicle(db, vehicle)

    return {
        "message": "Vehicle created successfully",
        "id": new_vehicle.id,
        "customer_id": new_vehicle.customer_id,
        "brand": new_vehicle.brand,
        "model": new_vehicle.model,
        "model_year": new_vehicle.model_year,
        "plate_number": new_vehicle.plate_number,
        "chassis_number": new_vehicle.chassis_number,
        "engine_number": new_vehicle.engine_number,
        "color": new_vehicle.color,
        "transmission": new_vehicle.transmission,
        "fuel_type": new_vehicle.fuel_type,
        "current_km": new_vehicle.current_km
    }


@router.get("/")
def get_vehicles(db: Session = Depends(get_db)):
    return VehicleService.get_vehicles(db)


@router.get("/customer/{customer_id}")
def get_customer_vehicles(customer_id: int, db: Session = Depends(get_db)):
    return VehicleService.get_customer_vehicles(db, customer_id)


@router.get("/{vehicle_id}")
def vehicle_profile(vehicle_id: int, db: Session = Depends(get_db)):
    data = VehicleService.get_vehicle_profile(db, vehicle_id)

    if not data:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return data


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db)
):
    updated = VehicleService.update_vehicle(db, vehicle_id, vehicle)

    if not updated:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {
        "message": "Vehicle updated successfully",
        "vehicle": updated
    }


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    deleted = VehicleService.delete_vehicle(db, vehicle_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {
        "message": "Vehicle deleted successfully"
    }