from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.customer import CustomerCreate
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    new_customer = CustomerService.create_customer(db, customer)

    return {
        "message": "Customer created successfully",
        "id": new_customer.id,
        "name": new_customer.name,
        "mobile": new_customer.mobile,
        "email": new_customer.email
    }


@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):
    return CustomerService.get_customers(db)


@router.get("/{customer_id}/profile")
def customer_profile(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """GET /customers/{customer_id}/profile -> returns Customer 360 data"""
    data = CustomerService.get_customer_360(db, customer_id)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return data


@router.get("/mobile/{mobile}")
def customer_by_mobile(
    mobile: str,
    db: Session = Depends(get_db)
):
    customer = CustomerService.customer_by_mobile(db, mobile)

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return customer


@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    updated = CustomerService.update_customer(
        db,
        customer_id,
        customer,
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return {
        "message": "Customer Updated",
        "customer": updated,
    }


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    deleted = CustomerService.delete_customer(
        db,
        customer_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return {
        "message": "Customer Deleted"
    }