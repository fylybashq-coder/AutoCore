from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.services.appointment_service import AppointmentService

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post("/")
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):
    new_appointment = AppointmentService.create_appointment(db, appointment)

    return {
        "message": "Appointment created successfully",
        "id": new_appointment.id,
        "customer_id": new_appointment.customer_id,
        "vehicle_id": new_appointment.vehicle_id,
        "appointment_date": new_appointment.appointment_date,
        "appointment_time": new_appointment.appointment_time,
        "service_type": new_appointment.service_type,
        "advisor": new_appointment.advisor,
        "status": new_appointment.status,
        "notes": new_appointment.notes,
    }


@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return AppointmentService.get_appointments(db)


@router.get("/customer/{customer_id}")
def get_customer_appointments(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return AppointmentService.get_customer_appointments(db, customer_id)


@router.get("/vehicle/{vehicle_id}")
def get_vehicle_appointments(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    return AppointmentService.get_vehicle_appointments(db, vehicle_id)


@router.put("/{appointment_id}")
def update_appointment(
    appointment_id: int,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    updated = AppointmentService.update_appointment(
        db,
        appointment_id,
        appointment
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return {
        "message": "Appointment updated successfully",
        "appointment": updated
    }


@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    deleted = AppointmentService.delete_appointment(
        db,
        appointment_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return {
        "message": "Appointment deleted successfully"
    }