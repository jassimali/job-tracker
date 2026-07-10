from fastapi import FastAPI
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

from app.routers.applications import router as applications_router
from app.routers.analytics import router as analytics_router
from app.routers.auth import router as auth_router


load_dotenv()


app = FastAPI()


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(applications_router)
app.include_router(analytics_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "JobTrack API is running"
    }