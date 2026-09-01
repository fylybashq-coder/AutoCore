from pydantic import BaseModel


class VehicleCreate(BaseModel):
    customer_id: int
    brand: str
    model: str
    model_year: int

    plate_number: str | None = None
    chassis_number: str | None = None
    engine_number: str | None = None

    color: str | None = None
    transmission: str | None = None
    fuel_type: str | None = None

    current_km: int = 0


class VehicleUpdate(BaseModel):
    brand: str
    model: str
    model_year: int

    plate_number: str | None = None
    chassis_number: str | None = None
    engine_number: str | None = None

    color: str | None = None
    transmission: str | None = None
    fuel_type: str | None = None

    current_km: int = 0