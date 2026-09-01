from pydantic import BaseModel
from typing import Optional


class CallCreate(BaseModel):
    customer_id: int
    vehicle_id: Optional[int] = None
    call_type: str
    notes: Optional[str] = None