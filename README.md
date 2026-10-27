# QuantForge

### Image-Based Financial Signal Analysis Using Classical Image Processing

**QuantForge** is an experimental project exploring how classical digital image processing techniques can be applied to noisy financial time-series signals to extract trends, detect structural changes, and evaluate signal reconstruction quality.

The project combines concepts from **Image and Video Processing, signal analysis, numerical evaluation, and quantitative finance**.

> **Project status:** 🚧 In Development

---

## Overview

Financial time-series data often contains noise and fluctuations that make underlying patterns difficult to identify.

QuantForge investigates whether a signal can be converted into a grayscale image, processed using classical image processing algorithms, and analyzed to recover useful structural information.

The results are compared against numerical signal-processing baselines to evaluate accuracy, computational cost, and practical limitations.

The initial implementation uses synthetic data with known underlying patterns. Historical market data may be introduced in later experiments.

## Objectives

- Generate synthetic financial-style signals with controllable noise and different regimes.
- Convert one-dimensional time-series signals into grayscale images.
- Apply classical image processing techniques to analyze signal structure.
- Compare image-based processing with conventional numerical methods.
- Evaluate reconstruction error, detection quality, runtime, and memory usage.
- Explore potential applications in quantitative research and financial signal analysis.

## Methodology

The planned workflow consists of the following stages:

1. **Signal Generation** — Generate underlying trends and add controlled random noise.
2. **Signal-to-Image Conversion** — Represent numerical signals as grayscale pixel arrays.
3. **Image Processing** — Apply smoothing filters, histogram processing, edge detection, and other relevant techniques.
4. **Feature Extraction** — Investigate trends, candidate change points, and structural features.
5. **Numerical Baselines** — Compare image-based results with conventional numerical filtering.
6. **Evaluation** — Measure reconstruction error, detection performance, runtime, and memory usage.

## Image Processing Techniques

The project will investigate techniques from the Image and Video Processing syllabus, including:

- Mean, median, and Gaussian filtering
- Histogram processing and equalization
- Canny edge detection
- Morphological operations
- Hough transform for geometric line detection, where appropriate

Not every technique is expected to improve every result. Experiments will assess their effectiveness and limitations.

## Evaluation Metrics

| Metric | Purpose |
|---|---|
| Mean Squared Error (MSE) | Measures squared reconstruction error |
| Mean Absolute Error (MAE) | Measures average absolute reconstruction error |
| Precision and Recall | Evaluates detection quality when reference events are available |
| Runtime | Measures computational efficiency |
| Memory Usage | Estimates resource consumption |

## Technology Stack

- **Language:** Python
- **Numerical Computing:** NumPy, SciPy
- **Image Processing:** OpenCV
- **Visualization:** Matplotlib
- **Data Analysis:** Pandas
- **Testing:** pytest
- **Experiments:** Jupyter Notebook
- **Version Control:** Git and GitHub

## Project Structure

```text
QuantForge/
├── data/
│   ├── synthetic/
│   └── market/
├── outputs/
│   ├── plots/
│   ├── images/
│   └── metrics/
├── src/
│   ├── generate_signals.py
│   ├── signal_to_image.py
│   ├── image_pipeline.py
│   ├── numerical_baselines.py
│   ├── feature_extraction.py
│   └── evaluation.py
├── experiments/
│   └── benchmark.ipynb
├── tests/
│   └── test_signal.py
├── report/
├── requirements.txt
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/QuantForge.git
cd QuantForge
```

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Generate a synthetic signal

```bash
python src/generate_signals.py
```

### 5. Run tests

```bash
python -m pytest -q
```

*Note: The complete image-processing pipeline and evaluation workflow are being implemented incrementally.*

## Future Work

- Complete the image-based signal-processing pipeline.
- Benchmark image-based processing against numerical baselines.
- Investigate robustness under different noise levels and signal regimes.
- Validate selected experiments on historical market data.
- Explore computational optimizations and reproducible quantitative experiments.
- Investigate backtesting only if the results justify a subsequent trading-strategy experiment.

## Scope and Disclaimer

QuantForge is an educational and experimental research project. Its initial synthetic signals are simplified representations rather than realistic market simulations.

Image processing does not inherently provide an advantage over direct numerical analysis. The purpose of this project is to investigate that question experimentally, not to assume the approach is superior.

This project is not financial advice and does not constitute a validated trading system.

---

**Author:** YOUR_NAME

**Focus Areas:** Digital Image Processing · Signal Analysis · Quantitative Research · Python
