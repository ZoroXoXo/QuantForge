#Generate clean signals, noise and regime changes


"""
QuantForge: Synthetic Financial Signal Generation

Generates a clean underlying signal and a noisy observation
with known trend and volatility regimes.
"""

import numpy as np


def generate_signal(n=1000, seed=42):
    """
    Returns:
        time: Time indices.
        clean_signal: Underlying signal without random noise.
        noisy_signal: Signal with added random noise.
        regimes: Labels describing the underlying regimes.
    """
    if n < 4:
        raise ValueError("n must be at least 4.")

    rng = np.random.default_rng(seed)
    time = np.arange(n)

    # Three regimes: uptrend, downtrend, and high-volatility sideways.
    first = n // 3
    second = 2 * n // 3

    clean_signal = np.zeros(n, dtype=float)
    regimes = np.empty(n, dtype=object)

    # Regime 1: upward trend
    clean_signal[:first] = 100 + 0.08 * time[:first]
    regimes[:first] = "uptrend"

    # Regime 2: downward trend
    start_price = clean_signal[first - 1]
    clean_signal[first:second] = (
        start_price - 0.08 * (time[first:second] - first + 1)
    )
    regimes[first:second] = "downtrend"

    # Regime 3: sideways signal
    start_price = clean_signal[second - 1]
    clean_signal[second:] = start_price
    regimes[second:] = "sideways"

    # Add more noise in the final regime.
    noise = np.zeros(n)
    noise[:second] = rng.normal(0, 1.5, second)
    noise[second:] = rng.normal(0, 5.0, n - second)

    noisy_signal = clean_signal + noise

    return time, clean_signal, noisy_signal, regimes


if __name__ == "__main__":
    import matplotlib.pyplot as plt

    time, clean, noisy, regimes = generate_signal()

    plt.figure(figsize=(12, 5))
    plt.plot(time, clean, label="Underlying signal", linewidth=2)
    plt.plot(time, noisy, label="Noisy observation", alpha=0.65)

    plt.title("QuantForge: Synthetic Signal with Market Regimes")
    plt.xlabel("Time")
    plt.ylabel("Simulated Price")
    plt.legend()
    plt.grid(alpha=0.3)
    plt.tight_layout()
    plt.show()

    print("Number of samples:", len(time))
    print("Regimes:", np.unique(regimes))
