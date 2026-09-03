import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.job_card import JobCard
from app.models.vehicle import Vehicle
from app.models.call import Call
from app.schemas.job_card import JobCardCreate, JobCardUpdateStatus

class JobCardRepository:

    @staticmethod
    def create(db: Session, data: JobCardCreate):
        # 1. توليد رقم تسلسلي فريد لأمر الشغل
        count = db.query(JobCard).count() + 1
        job_number = f"JC-{datetime.utcnow().year}-{count:04d}"
        
        # 2. حساب الإجمالي المبدئي
        total = (data.labor_cost or 0.0) + (data.parts_cost or 0.0)
        
        new_job = JobCard(
            job_number=job_number,
            customer_id=data.customer_id,
            vehicle_id=data.vehicle_id,
            current_km=data.current_km,
            fuel_level=data.fuel_level,
            advisor_name=data.advisor_name,
            technician_name=data.technician_name,
            service_type=data.service_type,
            customer_complaint=data.customer_complaint,
            labor_cost=data.labor_cost or 0.0,
            parts_cost=data.parts_cost or 0.0,
            total_amount=total,
            status="Reception"
        )
        db.add(new_job)

        # 3. تحديث الكيلومتر الحالي للسيارة تلقائياً
        vehicle = db.query(Vehicle).filter(Vehicle.id == data.vehicle_id).first()
        if vehicle and data.current_km > (vehicle.current_km or 0):
            vehicle.current_km = data.current_km

        db.commit()
        db.refresh(new_job)
        return new_job

    @staticmethod
    def get_all(db: Session):
        return db.query(JobCard).order_by(desc(JobCard.id)).all()

    @staticmethod
    def get_by_id(db: Session, job_id: int):
        return db.query(JobCard).filter(JobCard.id == job_id).first()

    @staticmethod
    def update_status(db: Session, job_id: int, update_data: JobCardUpdateStatus):
        job = db.query(JobCard).filter(JobCard.id == job_id).first()
        if not job:
            return None

        job.status = update_data.status
        if update_data.diagnosis_notes:
            job.diagnosis_notes = update_data.diagnosis_notes
        if update_data.labor_cost is not None:
            job.labor_cost = update_data.labor_cost
        if update_data.parts_cost is not None:
            job.parts_cost = update_data.parts_cost
            
        job.total_amount = job.labor_cost + job.parts_cost

        # Trigger تلقائي: إذا اكتملت الصيانة وجرى تسليم الفاتورة (Invoiced/Ready)، يتم إنشاء تذكرة متابعة كول سنتر بعد الصيانة
        if update_data.status in ["Invoiced", "Ready"]:
            job.completed_at = datetime.utcnow()
            followup_call = Call(
                customer_id=job.customer_id,
                vehicle_id=job.vehicle_id,
                call_type="Follow Up",
                status="Open",
                notes=f"Post-service follow-up for Job Card {job.job_number} ({job.service_type})"
            )
            db.add(followup_call)

        db.commit()
        db.refresh(job)
        return job