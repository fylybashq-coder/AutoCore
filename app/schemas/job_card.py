from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobCardCreate(BaseModel):
    customer_id: int
    vehicle_id: int
    current_km: int
    fuel_level: Optional[str] = "50%"
    advisor_name: Optional[str] = "Service Advisor"
    technician_name: Optional[str] = "Not Assigned"
    service_type: str
    customer_complaint: Optional[str] = None
    labor_cost: Optional[float] = 0.0
    parts_cost: Optional[float] = 0.0

class JobCardUpdateStatus(BaseModel):
    status: str
    diagnosis_notes: Optional[str] = None
    labor_cost: Optional[float] = None
    parts_cost: Optional[float] = None

class JobCardResponse(BaseModel):
    id: int
    job_number: str
    customer_id: int
    vehicle_id: int
    current_km: int
    fuel_level: str
    advisor_name: Optional[str]
    technician_name: Optional[str]
    status: str
    service_type: str
    customer_complaint: Optional[str]
    diagnosis_notes: Optional[str]
    labor_cost: float
    parts_cost: float
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True