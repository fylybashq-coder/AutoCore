from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerResponse])
@router.get("/", response_model=List[CustomerResponse])
def get_all_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    try:
        # التحقق من وجود رقم الهاتف مسبقاً إذا وُجد
        if payload.phone:
            exist = db.query(Customer).filter(Customer.phone == payload.phone).first()
            if exist:
                raise HTTPException(status_code=400, detail="Phone number is already registered")

        data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
        c = Customer(**data)
        db.add(c)
        db.commit()
        db.refresh(c)
        return c
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    c = db.query(Customer).filter(Customer.id == customer_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Customer not found")
    return c