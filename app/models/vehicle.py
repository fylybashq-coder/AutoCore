from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    model_year = Column(Integer, nullable=False)

    plate_number = Column(String, unique=True)
    chassis_number = Column(String, unique=True)
    engine_number = Column(String)

    color = Column(String)
    transmission = Column(String)
    fuel_type = Column(String)

    current_km = Column(Integer)

    customer = relationship(
        "Customer",
        back_populates="vehicles"
    )

    appointments = relationship("Appointment")