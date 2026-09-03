from pydantic import BaseModel
from typing import Optional

class VehicleBase(BaseModel):
    customer_id: int
    brand: str
    model: str
    year: Optional[int] = None
    plate_number: str
    vin: Optional[str] = None
    mileage: Optional[int] = 0

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    class Config:
        from_attributes = True