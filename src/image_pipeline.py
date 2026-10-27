#Apply smoothing, histogram processing and edge detection

import cv2


def apply_gaussian_filter(image, kernel_size=5, sigma=0):  #kernel_size is the neghborhood to calculate each filtered pixel,sigma is gaussian spread auto claculated by open cv based on kernel_size
    filtered_image = cv2.GaussianBlur(
        image,
        (kernel_size, kernel_size),
        sigma
    )
    return filtered_image