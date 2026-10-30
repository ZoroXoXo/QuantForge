from fastapi import FastAPI
from backend.app.api.signals import router as signals_router



app = FastAPI(
    title="QuantForge API",
    description="Quantitative Signal Research and Analysis Platform",
    version="0.1.0"
)


app.include_router(signals_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to QuantForge",
        "status": "running",
    }