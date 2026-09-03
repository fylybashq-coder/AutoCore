from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class JobCard(Base):
    __tablename__ = "job_cards"

    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String, unique=True, index=True, nullable=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    current_km = Column(Integer, nullable=True, default=0)
    fuel_level = Column(String, nullable=True, default="50%")
    advisor_name = Column(String, nullable=True, default="Advisor")
    technician_name = Column(String, nullable=True, default="Technician")
    service_type = Column(String, nullable=True, default="Periodic Maintenance")
    customer_complaint = Column(String, nullable=True)
    labor_cost = Column(Float, nullable=True, default=0.0)
    parts_cost = Column(Float, nullable=True, default=0.0)
    status = Column(String, nullable=False, default="Opened")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)