from time import perf_counter

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, model_validator
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.experiment import Experiment
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
def generate(
    request: SignalRequest,
    db: Session = Depends(get_db),
):
    try:
        start_time = perf_counter()

        result = run_signal_experiment(**request.model_dump())

        runtime_ms = (perf_counter() - start_time) * 1000

        experiment = Experiment(
            samples=request.n,
            seed=request.seed,
            sideways_noise_std=request.sideways_noise_std,
            gaussian_kernel=request.gaussian_kernel,
            moving_average_window=request.moving_average_window,
            noisy_mse=result["metrics"]["noisy_mse"],
            gaussian_mse=result["metrics"]["gaussian_mse"],
            numerical_mse=result["metrics"]["numerical_mse"],
            runtime_ms=runtime_ms,
        )

        db.add(experiment)
        db.commit()
        db.refresh(experiment)

        return {
            **result,
            "experiment_id": experiment.id,
            "runtime_ms": runtime_ms,
        }

    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))

    except Exception:
        db.rollback()
        raise