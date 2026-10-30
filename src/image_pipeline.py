#Apply smoothing, histogram processing and edge detection

import cv2

#applying gaussian filter
def apply_gaussian_filter(image, kernel_size=5, sigma=0):  #kernel_size is the neghborhood to calculate each filtered pixel,sigma is gaussian spread auto claculated by open cv based on kernel_size
    filtered_image = cv2.GaussianBlur(
        image,
        (kernel_size, kernel_size),
        sigma
    )
    return filtered_image

#applying median filter
def apply_median_filter(image, kernel_size=5):
    if kernel_size < 3 or kernel_size % 2 == 0:
        raise ValueError(
            "kernel_size must be an odd integer >= 3."
        )

    filtered_image = cv2.medianBlur(image, kernel_size) #opencv handles neighbourhood selection,soriting and median calculation for us

    return filtered_image
