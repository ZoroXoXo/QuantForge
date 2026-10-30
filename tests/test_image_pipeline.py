import numpy as np
from src.image_pipeline import apply_gaussian_filter


def test_gaussian_filter_preserves_image_shape():
    image = np.zeros((500, 1000), dtype=np.uint8)

    filtered = apply_gaussian_filter(image)

    assert filtered.shape == image.shape


def test_gaussian_filter_preserves_dtype():
    image = np.zeros((100, 100), dtype=np.uint8)

    filtered = apply_gaussian_filter(image)

    assert filtered.dtype == np.uint8


#creates black image,draws small white sq in centre,applies gaussian filter,compares to orig
def test_gaussian_filter_changes_noisy_image():
    image = np.zeros((100, 100), dtype=np.uint8)
    image[40:60, 40:60] = 255

    filtered = apply_gaussian_filter(image)

    assert not np.array_equal(filtered, image)

#testing for median filtering
import pytest
from src.image_pipeline import apply_median_filter


def test_median_filter_preserves_shape():
    image = np.zeros((100, 100), dtype=np.uint8)

    filtered = apply_median_filter(image)

    assert filtered.shape == image.shape


def test_median_filter_preserves_dtype():
    image = np.zeros((100, 100), dtype=np.uint8)

    filtered = apply_median_filter(image)

    assert filtered.dtype == image.dtype


def test_median_filter_removes_salt_noise():
    image = np.zeros((9, 9), dtype=np.uint8)
    image[4, 4] = 255

    filtered = apply_median_filter(image, kernel_size=3)

    assert filtered[4, 4] == 0


@pytest.mark.parametrize("kernel_size", [0, 2, 4, -3])
def test_median_filter_rejects_invalid_kernel(kernel_size):
    image = np.zeros((10, 10), dtype=np.uint8)

    with pytest.raises(ValueError):
        apply_median_filter(image, kernel_size)
