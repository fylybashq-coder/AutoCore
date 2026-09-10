from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate, VehicleResponse

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)

@router.post("/", response_model=VehicleResponse)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.get("/", response_model=list[VehicleResponse])
def get_vehicles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Vehicle).offset(skip).limit(limit).all()
