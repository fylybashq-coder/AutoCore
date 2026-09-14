from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db)
):
    return DashboardService.get_dashboard(db)
