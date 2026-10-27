import numpy as np
from src.signal_to_image import signal_to_image


def test_output_shape():
    image=signal_to_image([100,105,110,103,115])
    assert image.shape==(500,1000)

def test_output_dtype():
    image = signal_to_image([100, 105, 110, 103, 115])
    assert image.dtype == np.uint8

def test_image_contains_black_pixels():
    image = signal_to_image([100, 105, 110, 103, 115])
    assert np.any(image == 0)


import pytest
def test_empty_signal_raises_error():
    with pytest.raises(ValueError, match="Signal cannot be empty"):
        signal_to_image([])


def test_multidimensional_signal_raises_error():
    with pytest.raises(ValueError, match="one-dimensional"):
        signal_to_image([[100, 105], [110, 115]])


def test_non_finite_signal_raises_error():
    with pytest.raises(ValueError, match="finite values"):
        signal_to_image([100, np.nan, 110])

def test_invalid_dimensions_raise_error():
    with pytest.raises(ValueError, match="Width and height"):
        signal_to_image([100, 105, 110], width=0)

def test_infinite_signal_raises_error():
    with pytest.raises(ValueError, match="finite values"):
        signal_to_image([100, np.inf, 110])