#Convert a signal into a grayscale image

import numpy as np
import cv2

def signal_to_image(signal,width=1000,height=500):

    #signal cannot be empty
    if len(signal)==0:
        raise ValueError("Signal cannot be empty")

    #conversion to a numpy array
    signal = np.asarray(signal, dtype=float)

    #signal must be 1d
    if signal.ndim != 1:  
        raise ValueError("Signal must be one-dimensional.")

    #validating image dimensions
    if width <= 0 or height <= 0:
        raise ValueError("Width and height must be positive.")

    black_image=np.zeros((height,width),dtype=np.uint8)

    #to check wether signal only has finite numbers
    if not np.all(np.isfinite(signal)):
        raise ValueError("Signal must contain only finite values.")
    
    #normalization
    if np.max(signal)==np.min(signal):
        signal_norm=np.full(len(signal),0.5)
    else:    
        signal_norm=(signal-np.min(signal))/(np.max(signal)-np.min(signal))

    x = np.linspace(0, width - 1, len(signal)).astype(np.int32)  #(time)
    y=((1-signal_norm)*(height-1)).astype(np.int32)   #(signal value)  astype(np.int32) used this cause pixels only use int values
    
    #drawing the signal
    points=np.column_stack((x,y))
    cv2.polylines(black_image, [points], isClosed=False, color=255, thickness=3)  #thickeness changing from 1 to 3 to test median filtering more accurately


    return black_image

if __name__=="__main__":
    #Displaying generated image
    from src.generate_signals import generate_signal
    import matplotlib.pyplot as plt

    _, clean, noisy, _ = generate_signal()

    image = signal_to_image(noisy)

    plt.imshow(image, cmap="gray")
    plt.title("QuantForge: Signal as a Grayscale Image")
    plt.axis("off")
    plt.show()