from datetime import date, time
from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    customer_id: int
    vehicle_id: int

    appointment_date: date
    appointment_time: time

    service_type: str

    advisor: str | None = None
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    vehicle_id: int

    appointment_date: date
    appointment_time: time

    service_type: str

    advisor: str | None = None
    notes: str | None = None