#Apply conventional numerical filters for comparison


import numpy as np


def moving_average(signal, window_size=5):
    signal = np.asarray(signal, dtype=float)

    if signal.ndim != 1 or signal.size == 0:
        raise ValueError("Signal must be a non-empty 1D array.")

    if not np.all(np.isfinite(signal)):
        raise ValueError("Signal must contain only finite values.")

    if window_size < 1 or window_size % 2 == 0:
        raise ValueError("window_size must be a positive odd integer.")

    # Repeat edge values to preserve the original signal length.
    half = window_size // 2
    padded = np.pad(signal, (half, half), mode="edge")

    kernel = np.ones(window_size) / window_size

    return np.convolve(padded, kernel, mode="valid")
