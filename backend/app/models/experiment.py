from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.database import Base


class Experiment(Base):
    __tablename__ = "experiments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    samples: Mapped[int] = mapped_column(Integer, nullable=False)
    seed: Mapped[int] = mapped_column(Integer, nullable=False)

    sideways_noise_std: Mapped[float] = mapped_column(Float, nullable=False)
    gaussian_kernel: Mapped[int] = mapped_column(Integer, nullable=False)
    moving_average_window: Mapped[int] = mapped_column(Integer, nullable=False)

    noisy_mse: Mapped[float] = mapped_column(Float, nullable=False)
    gaussian_mse: Mapped[float] = mapped_column(Float, nullable=False)
    numerical_mse: Mapped[float] = mapped_column(Float, nullable=False)

    runtime_ms: Mapped[float] = mapped_column(Float, nullable=False)