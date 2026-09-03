from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=True)
    plate_number = Column(String, unique=True, index=True, nullable=False)
    vin = Column(String, nullable=True)
    mileage = Column(Integer, default=0)

    owner = relationship("Customer", back_populates="vehicles")