from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.call_center import MobileSearch
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/call-center",
    tags=["Call Center"]
)


@router.post("/search")
def search_customer(
    request: MobileSearch,
    db: Session = Depends(get_db)
):

    data = CustomerService.get_customer_360(
        db,
        request.mobile
    )

    if data is None:
        return {
            "customer": None,
            "action": "CREATE_CUSTOMER"
        }

    return {
        "action": "OPEN_CUSTOMER_360",
        "data": data
    }