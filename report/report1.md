# QuantForge
## Comparative Analysis of Image-Based and Numerical Signal Denoising

### 1. Abstract

QuantForge investigates whether classical image-processing techniques can be used to denoise and reconstruct synthetic financial-style signals.

The project converts one-dimensional noisy signals into grayscale images, applies image-processing filters, and reconstructs the signals. Its performance is compared against direct numerical smoothing using a moving-average filter.

Experiments investigate reconstruction accuracy, filter parameters, signal regimes, transition regions, noise sensitivity, and generalization to unseen signals.

Independent testing suggests that Gaussian image filtering performs better at higher noise levels, while numerical moving-average smoothing performs better at lower noise levels. However, statistical testing does not establish a significant difference after multiple-comparison correction.

### 2. Methodology

#### 2.1 Synthetic signal generation

A synthetic signal containing three regimes is generated:

- Uptrend
- Downtrend
- Sideways

The signal contains Gaussian noise. The first two regimes use a standard deviation of 1.5, while the sideways regime has a configurable noise standard deviation.

The generator uses NumPy's random number generator with fixed seeds to ensure reproducibility.

#### 2.2 Signal-to-image conversion

The noisy signal is normalized and represented as a grayscale image.

The image uses:

- Width: 1000 pixels
- Height: 500 pixels
- Line thickness: 3 pixels

#### 2.3 Image processing

The project investigates:

- Gaussian filtering
- Median filtering

Gaussian filtering is performed using OpenCV's `GaussianBlur`.

#### 2.4 Signal reconstruction

The filtered image is converted back into a one-dimensional signal by identifying the brightest pixel in each image column.

The recovered pixel coordinates are mapped back to the original signal's value range.

#### 2.5 Numerical baseline

A direct numerical moving-average filter is implemented using NumPy.

Both approaches are evaluated using Mean Squared Error (MSE).

### 3. Gaussian Parameter Optimization

The Gaussian kernel size was varied from 3 to 301.

The best tested configuration was:

| Parameter | Value |
|---|---:|
| Image thickness | 3 |
| Gaussian kernel | 151 |
| Average MSE | 0.3098 |
| Trials | 20 |

Increasing the kernel initially reduced reconstruction error. Beyond kernel 151, excessive smoothing increased error.

These results represent the parameter-optimization experiments and should be distinguished from the independent test evaluation.

### 4. Comparison with Numerical Smoothing

The best tested numerical moving-average configuration was:

| Method | Configuration | Average MSE |
|---|---:|---:|
| Gaussian image pipeline | Kernel 151 | 0.3098 |
| Numerical moving average | Window 71 | 0.2796 |

The numerical baseline achieved approximately 9.7% lower MSE in this experiment.

### 5. Regime-Wise Evaluation

Twenty-seed evaluation produced the following results:

| Regime | Gaussian MSE | Numerical MSE |
|---|---:|---:|
| Uptrend | 0.2132 | 0.1136 |
| Downtrend | 0.2092 | 0.0905 |
| Sideways | 0.5063 | 0.6338 |

Numerical smoothing performed better in the uptrend and downtrend regimes.

Gaussian filtering performed better in the sideways regime.

### 6. Transition-Region Evaluation

Reconstruction errors were evaluated in 51-point windows around the two regime transitions.

| Transition | Gaussian MSE | Numerical MSE |
|---|---:|---:|
| Uptrend to Downtrend (333) | 0.2988 | 0.6171 |
| Downtrend to Sideways (666) | 0.7576 | 0.2756 |

The results indicate that reconstruction performance varies depending on local signal structure.

### 7. Noise Sensitivity and Parameter Optimization

Sideways noise standard deviation was varied across five levels:

1.5, 3.0, 5.0, 7.0 and 10.0.

Gaussian and numerical filters were independently optimized using 20 training seeds.

| Noise STD | Best Gaussian Kernel | Gaussian MSE | Best Numerical Window | Numerical MSE |
|---:|---:|---:|---:|---:|
| 1.5 | 121 | 0.0624 | 51 | 0.0661 |
| 3.0 | 181 | 0.1791 | 71 | 0.2345 |
| 5.0 | 201 | 0.4213 | 71 | 0.6338 |
| 7.0 | 201 | 0.7894 | 71 | 1.2328 |
| 10.0 | 201 | 1.6220 | 71 | 2.5058 |

Gaussian filtering achieved lower training MSE at all five noise levels.

These values describe performance on the training experiments used for parameter selection. They should not be interpreted as independent generalization results.

### 8. Independent Test Evaluation

After selecting the filter configurations using the training data, the selected configurations were evaluated on 50 previously unseen seeds (100–149).

| Noise STD | Gaussian MSE | Numerical MSE | Better Average |
|---:|---:|---:|---|
| 1.5 | 0.0697 | 0.0590 | Numerical |
| 3.0 | 0.2117 | 0.1982 | Numerical |
| 5.0 | 0.5018 | 0.5298 | Gaussian |
| 7.0 | 0.9430 | 1.0270 | Gaussian |
| 10.0 | 1.9071 | 2.0835 | Gaussian |

The independent test suggests a change in relative performance:

- Numerical smoothing performs better at lower noise levels.
- Gaussian image processing performs better at higher noise levels.

At noise STD 10, Gaussian filtering achieved approximately 8.5% lower MSE than numerical smoothing.

### 9. Statistical Evaluation

Five paired Wilcoxon signed-rank tests were performed, one for each noise level, using the 50 independent test signals.

| Noise STD | Mean Difference (Gaussian − Numerical) | p-value |
|---:|---:|---:|
| 1.5 | +0.01073 | 0.03369 |
| 3.0 | +0.01350 | 0.42630 |
| 5.0 | −0.02803 | 0.70895 |
| 7.0 | −0.08401 | 0.37767 |
| 10.0 | −0.17635 | 0.33257 |

Bonferroni correction was applied across the five comparisons. Using an initial significance level of 0.05, the adjusted significance threshold was:

**α = 0.05 / 5 = 0.01**

No comparison reached this corrected threshold.

Paired win counts also showed a gradual shift:

| Noise STD | Gaussian Wins | Numerical Wins |
|---:|---:|---:|
| 1.5 | 21 | 29 |
| 3.0 | 23 | 27 |
| 5.0 | 27 | 23 |
| 7.0 | 30 | 20 |
| 10.0 | 29 | 21 |

These results suggest a change in relative performance, but do not establish statistically significant superiority.

### 10. Limitations

The experiments use synthetic signals with controlled regime structures and Gaussian noise.

Consequently:

- The results do not establish performance across all financial signal structures.
- The noise sensitivity analysis focuses on the configurable sideways-regime noise level.
- Results should not be assumed to generalize directly to real financial market data.
- The statistical tests do not establish significant superiority after multiple-comparison correction.
- Further testing is needed across additional signal structures, noise distributions, and datasets.

### 11. Conclusion

QuantForge demonstrates that one-dimensional signals can be represented as images, processed using classical image-processing techniques, and reconstructed for quantitative evaluation.

The experiments show that:

1. Gaussian filtering can achieve competitive reconstruction accuracy.
2. Numerical moving-average smoothing performs well at lower noise levels.
3. Gaussian image filtering achieves lower average test error at higher sideways noise levels.
4. Reconstruction quality depends on signal regime and filter parameters.
5. Independent testing is essential because training performance alone can be misleading.

The project does not establish that image processing is universally superior to numerical filtering. Instead, it demonstrates that image-based processing is a viable alternative whose relative performance depends on the characteristics of the input signal.

### 12. Future Work

Potential improvements include:

- Testing additional image-processing filters.
- Investigating alternative signal-to-image representations.
- Improving image-to-signal reconstruction.
- Testing additional signal structures and noise distributions.
- Evaluating runtime and computational complexity.
- Increasing the number of independent test signals.
- Investigating adaptive filter selection based on estimated noise characteristics.

The ultimate objective is to understand when image-based processing provides useful advantages over conventional numerical signal-processing methods.