from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers.customers import router as customers_router
from app.routers.vehicles import router as vehicles_router
from app.routers.job_cards import router as job_cards_router
from app.routers.calls import router as calls_router
from app.routers.appointments import router as appointments_router
from app.routers.tickets import router as tickets_router

# إنشاء الجداول في قاعدة البيانات تلقائياً
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoCore DMS API",
    description="Automotive Workshop & Customer Care ERP System",
    version="1.0.0"
)

# السماح للفرونت إند (React / Vite) بالاتصال دون مشاكل CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تسجيل الراوترات
app.include_router(customers_router)
app.include_router(vehicles_router)
app.include_router(job_cards_router)
app.include_router(calls_router)
app.include_router(appointments_router)
app.include_router(tickets_router)

@app.get("/")
def read_root():
    return {"message": "AutoCore DMS API is running successfully"}