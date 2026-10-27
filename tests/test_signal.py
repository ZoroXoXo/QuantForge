#Check that signal generation works correctly


import numpy as np

from src.generate_signals import generate_signal


def test_signal_shapes():
    time, clean, noisy, regimes = generate_signal(n=300)

    assert len(time) == 300
    assert len(clean) == 300
    assert len(noisy) == 300
    assert len(regimes) == 300


def test_signal_is_reproducible():
    first = generate_signal(seed=42)
    second = generate_signal(seed=42)

    np.testing.assert_array_equal(first[2], second[2])


def test_signal_contains_three_regimes():
    _, _, _, regimes = generate_signal()

    assert set(regimes) == {"uptrend", "downtrend", "sideways"}
