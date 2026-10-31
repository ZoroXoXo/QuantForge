from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.experiment import Experiment

from sqlalchemy import func

router = APIRouter(prefix="/api/v1/experiments", tags=["Experiments"])


@router.get("/")
def get_experiments(db: Session = Depends(get_db)):
    return (
        db.query(Experiment)
        .order_by(Experiment.created_at.desc())
        .all()
    )

@router.get("/stats")
def get_experiment_stats(db: Session = Depends(get_db)):
    stats = db.query(
        func.count(Experiment.id).label("total_experiments"),
        func.coalesce(func.sum(Experiment.samples), 0).label("total_samples"),
        func.coalesce(func.min(Experiment.gaussian_mse), 0).label("best_gaussian_mse"),
        func.coalesce(func.min(Experiment.numerical_mse), 0).label("best_numerical_mse"),
        func.coalesce(func.avg(Experiment.runtime_ms), 0).label("average_runtime_ms"),
        func.coalesce(func.avg(Experiment.gaussian_mse), 0).label("average_gaussian_mse"),
        func.coalesce(func.avg(Experiment.numerical_mse), 0).label("average_numerical_mse"),
    ).first()

    return {
        "total_experiments": stats.total_experiments,
        "total_samples": stats.total_samples,
        "best_gaussian_mse": stats.best_gaussian_mse,
        "best_numerical_mse": stats.best_numerical_mse,
        "average_runtime_ms": stats.average_runtime_ms,
        "average_gaussian_mse": stats.average_gaussian_mse,
        "average_numerical_mse": stats.average_numerical_mse,
    }


@router.get("/{experiment_id}")
def get_experiment(
    experiment_id: int,
    db: Session = Depends(get_db),
):
    experiment = db.query(Experiment).filter(
        Experiment.id == experiment_id
    ).first()

    if experiment is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not found",
        )

    return experiment


@router.delete("/{experiment_id}")
def delete_experiment(
    experiment_id: int,
    db: Session = Depends(get_db),
):
    experiment = db.query(Experiment).filter(
        Experiment.id == experiment_id
    ).first()

    if experiment is None:
        raise HTTPException(
            status_code=404,
            detail="Experiment not found",
        )

    db.delete(experiment)
    db.commit()

    return {"message": "Experiment deleted successfully"}