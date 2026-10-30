from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, model_validator

from backend.app.services.signal_service import run_signal_experiment

router = APIRouter(prefix="/api/v1/signals", tags=["Signals"])


class SignalRequest(BaseModel):
    n: int = Field(default=1000, ge=4, le=10000)
    seed: int = 42
    sideways_noise_std: float = Field(default=5.0, ge=0)
    gaussian_kernel: int = Field(default=151, ge=1, le=301)
    moving_average_window: int = Field(default=71, ge=1, le=301)

    @model_validator(mode="after")
    def validate_kernels(self):
        if self.gaussian_kernel % 2 == 0:
            raise ValueError("Gaussian kernel must be odd.")

        if self.moving_average_window % 2 == 0:
            raise ValueError("Moving-average window must be odd.")

        return self


@router.post("/generate")
def generate(request: SignalRequest):
    try:
        return run_signal_experiment(**request.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))