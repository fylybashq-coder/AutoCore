from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))

    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)

    service_type = Column(String, nullable=False)

    advisor = Column(String)

    status = Column(String, default="Scheduled")

    notes = Column(String)

    customer = relationship("Customer")
    vehicle = relationship("Vehicle")