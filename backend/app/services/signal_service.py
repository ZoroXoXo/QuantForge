import numpy as np

from src.generate_signals import generate_signal
from src.signal_to_image import signal_to_image
from src.recover_signal import recover_signal
from src.image_pipeline import apply_gaussian_filter
from src.numerical_baselines import moving_average


def run_signal_experiment(
    n=1000,
    seed=42,
    sideways_noise_std=5.0,
    gaussian_kernel=151,
    moving_average_window=71,
):
    # 1. Generate synthetic financial signal
    time, clean, noisy, regimes = generate_signal(
        n=n,
        seed=seed,
        sideways_noise_std=sideways_noise_std,
    )

    # 2. Convert noisy signal into an image
    image = signal_to_image(noisy)

    # 3. Apply Gaussian image filtering
    gaussian_image = apply_gaussian_filter(
        image,
        kernel_size=gaussian_kernel,
    )

    # 4. Recover the signal from the filtered image
    gaussian_recovered = recover_signal(
        gaussian_image,
        float(np.min(noisy)),
        float(np.max(noisy)),
    )

    # 5. Apply numerical moving-average filtering
    numerical_recovered = moving_average(
        noisy,
        window_size=moving_average_window,
    )

    # 6. Evaluate reconstruction errors
    gaussian_mse = float(np.mean((clean - gaussian_recovered) ** 2))
    numerical_mse = float(np.mean((clean - numerical_recovered) ** 2))

    return {
        "time": time.tolist(),
        "clean_signal": clean.tolist(),
        "noisy_signal": noisy.tolist(),
        "gaussian_recovered": gaussian_recovered.tolist(),
        "numerical_recovered": numerical_recovered.tolist(),
        "regimes": regimes.tolist(),
        "metrics": {
            "noisy_mse": float(np.mean((clean - noisy) ** 2)),
            "gaussian_mse": gaussian_mse,
            "numerical_mse": numerical_mse,
        },
        "parameters": {
            "samples": n,
            "seed": seed,
            "sideways_noise_std": sideways_noise_std,
            "gaussian_kernel": gaussian_kernel,
            "moving_average_window": moving_average_window,
        },
    }