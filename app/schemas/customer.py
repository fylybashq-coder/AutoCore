from pydantic import BaseModel

class CustomerCreate(BaseModel):
    name: str
    mobile: str
    email: str | None = None