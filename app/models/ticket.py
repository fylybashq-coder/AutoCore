from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Ticket(BaseModel if 'BaseModel' in globals() else Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String, unique=True, index=True, nullable=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, default="Normal")
    status = Column(String, default="New")
    created_at = Column(DateTime, default=datetime.utcnow)