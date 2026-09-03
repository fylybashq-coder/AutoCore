from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.ticket import Ticket
from app.models.job_card import JobCard

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)

class TicketCreate(BaseModel):
    customer_id: int
    vehicle_id: Optional[int] = None
    subject: Optional[str] = "Support Request"
    description: Optional[str] = ""
    priority: Optional[str] = "Normal"
    status: Optional[str] = "New"

class TicketUpdate(BaseModel):
    customer_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def get_tickets(db: Session = Depends(get_db)):
    try:
        items = db.query(Ticket).order_by(Ticket.id.desc()).all()
        result = []
        for t in items:
            result.append({
                "id": t.id,
                "ticket_number": getattr(t, "ticket_number", None) or f"TCK-{t.id:04d}",
                "customer_id": t.customer_id,
                "vehicle_id": t.vehicle_id,
                "subject": getattr(t, "subject", None) or "Support Request",
                "description": getattr(t, "description", None) or "",
                "priority": getattr(t, "priority", None) or "Normal",
                "status": getattr(t, "status", None) or "New",
                "created_at": t.created_at.isoformat() if hasattr(t, "created_at") and t.created_at else datetime.utcnow().isoformat()
            })
        return result
    except Exception as e:
        print(f"Error fetching tickets: {e}")
        return []

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    try:
        # إنشاء كائن التذكرة بالمعاملات الأساسية فقط لضمان عدم حدوث تعارض
        ticket = Ticket(
            customer_id=payload.customer_id,
            vehicle_id=payload.vehicle_id,
            subject=payload.subject or "Support Request",
            description=payload.description or "",
            status=payload.status or "New"
        )
        
        db.add(ticket)
        db.commit()
        db.refresh(ticket)

        return {
            "id": ticket.id,
            "ticket_number": f"TCK-{ticket.id:04d}",
            "status": ticket.status,
            "message": "Ticket created successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{ticket_id}")
@router.patch("/{ticket_id}")
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    try:
        item = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        if payload.customer_id is not None:
            item.customer_id = payload.customer_id
        if payload.vehicle_id is not None:
            item.vehicle_id = payload.vehicle_id
        if payload.subject is not None:
            item.subject = payload.subject
        if payload.description is not None:
            item.description = payload.description
        if payload.status is not None:
            item.status = payload.status

        db.commit()
        db.refresh(item)
        return {"id": item.id, "status": item.status, "message": "Updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{ticket_id}/convert-to-job")
def convert_to_job_card(ticket_id: int, db: Session = Depends(get_db)):
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")

        card = JobCard(
            customer_id=ticket.customer_id,
            vehicle_id=ticket.vehicle_id or 1,
            current_km=0,
            fuel_level="50%",
            advisor_name="Support Desk",
            technician_name="TBD",
            service_type="Corrective Repair",
            customer_complaint=f"[Ticket #{ticket.id}] {ticket.subject}: {ticket.description}",
            labor_cost=0.0,
            parts_cost=0.0,
            status="Opened"
        )
        ticket.status = "Resolved"
    
        db.add(card)
        db.commit()
        db.refresh(card)
        return {"message": "Converted successfully", "job_card_id": card.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))