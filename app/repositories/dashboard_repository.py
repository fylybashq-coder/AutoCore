from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.models.customer import Customer
from app.models.vehicle import Vehicle
from app.models.appointment import Appointment
from app.models.call import Call


class DashboardRepository:

    @staticmethod
    def get_dashboard(db: Session):

        customers = db.query(func.count(Customer.id)).scalar()

        vehicles = db.query(func.count(Vehicle.id)).scalar()

        appointments = (
            db.query(func.count(Appointment.id))
            .filter(
                Appointment.appointment_date == date.today()
            )
            .scalar()
        )

        calls = (
            db.query(func.count(Call.id))
            .filter(Call.status == "Open")
            .scalar()
        )

        recent_customers = (
            db.query(Customer)
            .order_by(Customer.id.desc())
            .limit(5)
            .all()
        )

        today_appointments = (
            db.query(Appointment)
            .filter(
                Appointment.appointment_date == date.today()
            )
            .all()
        )

        return {
            "customers": customers,
            "vehicles": vehicles,
            "appointments": appointments,
            "calls": calls,
            "recent_customers": recent_customers,
            "today_appointments": today_appointments,
        }