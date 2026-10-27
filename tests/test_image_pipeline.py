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