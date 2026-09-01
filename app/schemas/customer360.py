from pydantic import BaseModel
from typing import List


class VehicleResponse(BaseModel):
    id: int
    brand: str
    model: str
    model_year: int

    class Config:
        from_attributes = True


class AppointmentResponse(BaseModel):
    id: int
    appointment_date: str
    appointment_time: str
    status: str

    class Config:
        from_attributes = True


class Customer360Response(BaseModel):
    customer: dict
    vehicles: List[VehicleResponse]
    appointments: List[AppointmentResponse]