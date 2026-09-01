from pydantic import BaseModel


class MobileSearch(BaseModel):
    mobile: str