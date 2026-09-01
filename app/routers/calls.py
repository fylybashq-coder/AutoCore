from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.call import CallCreate
from app.services.call_service import CallService

router = APIRouter(
    prefix="/calls",
    tags=["Calls"]
)


@router.post("/")
def create_call(
    call: CallCreate,
    db: Session = Depends(get_db)
):
    return CallService.create_call(db, call)


@router.get("/")
def get_calls(
    db: Session = Depends(get_db)
):
    return CallService.get_calls(db)


@router.get("/customer/{customer_id}")
def get_customer_calls(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return CallService.get_customer_calls(
        db,
        customer_id
    )


@router.get("/vehicle/{vehicle_id}")
def get_vehicle_calls(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    return CallService.get_vehicle_calls(
        db,
        vehicle_id
    )