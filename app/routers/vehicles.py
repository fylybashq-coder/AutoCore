from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
@router.get("/", response_model=List[VehicleResponse])
def get_all_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)):
    exist = db.query(Vehicle).filter(Vehicle.plate_number == payload.plate_number).first()
    if exist:
        raise HTTPException(status_code=400, detail="Plate number already exists")
    v = Vehicle(**payload.dict())
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v