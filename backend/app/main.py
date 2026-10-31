from fastapi import FastAPI
from backend.app.api.signals import router as signals_router
from fastapi.middleware.cors import CORSMiddleware #to configure CORS
from backend.app.db.database import Base, engine
from backend.app.models import experiment  # Registers the Experiment model
from backend.app.api.experiments import router as experiments_router #for retrieving saved exp

Base.metadata.create_all(bind=engine) #Creates experiment table if it doesnt alr exist
#wont del existing records

app = FastAPI(
    title="QuantForge API",
    description="Quantitative Signal Research and Analysis Platform",
    version="0.1.0"
)


app.include_router(signals_router)
app.include_router(experiments_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to QuantForge",
        "status": "running",
    }


#configuring CORS so that req are not blocked between react app and fastapi running on diff ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

