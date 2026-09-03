import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.job_card import JobCard
from app.models.vehicle import Vehicle
from app.models.call import Call

router = APIRouter(
    prefix="/job-cards",
    tags=["Job Cards"]
)

class StatusUpdate(BaseModel):
    status: str

class JobCardCreate(BaseModel):
    customer_id: int
    vehicle_id: int
    current_km: Optional[int] = 0
    fuel_level: Optional[str] = "50%"
    advisor_name: Optional[str] = "Philip (Advisor)"
    technician_name: Optional[str] = "Mahmoud (Tech)"
    service_type: Optional[str] = "Periodic Maintenance"
    customer_complaint: Optional[str] = None
    labor_cost: Optional[float] = 0.0
    parts_cost: Optional[float] = 0.0

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def get_job_cards(db: Session = Depends(get_db)):
    cards = db.query(JobCard).order_by(JobCard.id.desc()).all()
    return [
        {
            "id": c.id,
            "job_number": getattr(c, "job_number", f"JC-{c.id:04d}"),
            "customer_id": c.customer_id,
            "vehicle_id": c.vehicle_id,
            "current_km": c.current_km,
            "fuel_level": c.fuel_level,
            "advisor_name": c.advisor_name,
            "technician_name": c.technician_name,
            "service_type": c.service_type,
            "customer_complaint": c.customer_complaint,
            "labor_cost": c.labor_cost,
            "parts_cost": c.parts_cost,
            "status": c.status,
            "created_at": c.created_at.isoformat() if hasattr(c, "created_at") and c.created_at else None
        }
        for c in cards
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_job_card(payload: JobCardCreate, db: Session = Depends(get_db)):
    try:
        # توليد رقم تسلسلي فريد لأمر الشغل تلقائياً لمنع أي تعارض
        last_card = db.query(JobCard).order_by(JobCard.id.desc()).first()
        next_id = (last_card.id + 1) if last_card else 1
        generated_job_number = f"JC-{datetime.utcnow().year}-{next_id:04d}"

        card = JobCard(
            job_number=generated_job_number,
            customer_id=payload.customer_id,
            vehicle_id=payload.vehicle_id,
            current_km=payload.current_km or 0,
            fuel_level=payload.fuel_level or "50%",
            advisor_name=payload.advisor_name or "Philip (Advisor)",
            technician_name=payload.technician_name or "Mahmoud (Tech)",
            service_type=payload.service_type or "Periodic Maintenance",
            customer_complaint=payload.customer_complaint or "",
            labor_cost=float(payload.labor_cost or 0.0),
            parts_cost=float(payload.parts_cost or 0.0),
            status="Opened"
        )
        db.add(card)
        db.commit()
        db.refresh(card)
        return card
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{card_id}/status")
def update_job_card_status(card_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    card = db.query(JobCard).filter(JobCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Job Card not found")

    old_status = card.status
    card.status = payload.status

    if payload.status == "Delivered" and old_status != "Delivered":
        card.completed_at = datetime.utcnow()
        vehicle = db.query(Vehicle).filter(Vehicle.id == card.vehicle_id).first()
        if vehicle and card.current_km:
            vehicle.mileage = card.current_km

        try:
            follow_up_call = Call(
                customer_id=card.customer_id,
                vehicle_id=card.vehicle_id,
                call_type="PSFU",
                status="Scheduled",
                scheduled_date=datetime.utcnow() + timedelta(days=2),
                notes=f"Automated Follow-up: Vehicle delivered under Job Card {getattr(card, 'job_number', f'#{card.id}')}."
            )
            db.add(follow_up_call)
        except Exception:
            pass

    db.commit()
    db.refresh(card)
    return card