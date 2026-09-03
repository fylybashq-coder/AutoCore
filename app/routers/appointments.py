from datetime import datetime, date, time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.appointment import Appointment

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

class AppointmentCreate(BaseModel):
    customer_id: int
    vehicle_id: Optional[int] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = "10:30 AM"
    service_type: Optional[str] = "Periodic Maintenance"
    advisor: Optional[str] = "Service Advisor"
    status: Optional[str] = "Booked"
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    customer_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    service_type: Optional[str] = None
    advisor: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

def parse_date_safely(date_val: Optional[str]) -> date:
    if not date_val:
        return date.today()
    try:
        clean_str = str(date_val).split("T")[0].strip()
        return datetime.strptime(clean_str, "%Y-%m-%d").date()
    except Exception:
        return date.today()

def parse_time_safely(time_val: Optional[str]) -> time:
    if not time_val:
        return time(10, 30)
    cleaned = str(time_val).strip()
    # تجربة صيغ الوقت المختلفة (AM/PM أو 24-hour)
    for fmt in ("%I:%M %p", "%I:%M%p", "%H:%M", "%H:%M:%S"):
        try:
            return datetime.strptime(cleaned, fmt).time()
        except ValueError:
            pass
    return time(10, 30)

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def get_appointments(db: Session = Depends(get_db)):
    items = db.query(Appointment).order_by(Appointment.id.desc()).all()
    return [
        {
            "id": a.id,
            "customer_id": a.customer_id,
            "vehicle_id": a.vehicle_id,
            "appointment_date": str(a.appointment_date) if a.appointment_date else None,
            "appointment_time": a.appointment_time.strftime("%I:%M %p") if isinstance(a.appointment_time, time) else str(a.appointment_time or "10:30 AM"),
            "service_type": getattr(a, "service_type", "Periodic Maintenance"),
            "advisor": getattr(a, "advisor", "Service Advisor"),
            "status": a.status or "Draft",
            "notes": a.notes or ""
        }
        for a in items
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    try:
        parsed_date = parse_date_safely(payload.appointment_date)
        parsed_time = parse_time_safely(payload.appointment_time)

        booking = Appointment(
            customer_id=payload.customer_id,
            vehicle_id=payload.vehicle_id,
            appointment_date=parsed_date,
            appointment_time=parsed_time,
            service_type=payload.service_type or "Periodic Maintenance",
            advisor=payload.advisor or "Service Advisor",
            status=payload.status or "Booked",
            notes=payload.notes or ""
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{appointment_id}")
@router.patch("/{appointment_id}")
def update_full_appointment(appointment_id: int, payload: AppointmentUpdate, db: Session = Depends(get_db)):
    item = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if payload.customer_id is not None:
        item.customer_id = payload.customer_id
    if payload.vehicle_id is not None:
        item.vehicle_id = payload.vehicle_id
    if payload.appointment_date is not None:
        item.appointment_date = parse_date_safely(payload.appointment_date)
    if payload.appointment_time is not None:
        item.appointment_time = parse_time_safely(payload.appointment_time)
    if payload.service_type is not None:
        item.service_type = payload.service_type
    if payload.advisor is not None:
        item.advisor = payload.advisor
    if payload.status is not None:
        item.status = payload.status
    if payload.notes is not None:
        item.notes = payload.notes

    db.commit()
    db.refresh(item)
    return item