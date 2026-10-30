
import numpy as np

#for the first version we assume that every image column contains part of white signal line which equals image width
def recover_signal(image, signal_min, signal_max):
    if image.ndim != 2:
        raise ValueError("Image must be two-dimensional.")

    if image.shape[0] < 2 or image.shape[1] == 0:
        raise ValueError("Image dimensions are invalid.")

    if not np.all(np.isfinite(image)):
        raise ValueError("Image must contain only finite values.")

    if signal_min > signal_max:
        raise ValueError("signal_min must not exceed signal_max.")

    # Find the brightest pixel in each column.
    y_pixels = np.argmax(image, axis=0)
    #axis=0 means we evaluate each column vertically
    #argmax returns the brightest pixel row index in each column,but keep in mind that gaussian filtering can change which is the brightest pixel

    # Convert pixel coordinates back to normalized signal values.
    signal_norm = 1 - y_pixels / (image.shape[0] - 1)

    # Reverse the original min-max normalization.
    recovered_signal = (
        signal_min + signal_norm * (signal_max - signal_min)
    )

    return recovered_signal
