from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers.customers import router as customer_router
from app.routers.vehicles import router as vehicle_router
from app.routers.appointments import router as appointment_router
from app.routers.calls import router as call_router
from app.routers.call_center import router as call_center_router
from app.routers.dashboard import router as dashboard_router
from app.routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoCore API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer_router)
app.include_router(vehicle_router)
app.include_router(appointment_router)
app.include_router(call_router)
app.include_router(call_center_router)
app.include_router(dashboard_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AutoCore API"
    }