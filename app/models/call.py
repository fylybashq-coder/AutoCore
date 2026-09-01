from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=True
    )

    call_type = Column(String, nullable=False)

    status = Column(
        String,
        default="Open"
    )

    notes = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    customer = relationship("Customer")
    vehicle = relationship("Vehicle")