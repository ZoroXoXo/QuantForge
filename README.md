# QuantForge

### A Quantitative Research and Signal Analysis Platform

QuantForge is an experimental quantitative research platform exploring the application of classical image processing techniques to financial-style time-series signals.

What started as an Image and Video Processing research project has evolved into a full-stack application for signal generation, processing, reconstruction, quantitative evaluation, and experiment tracking.

The project combines digital signal processing, computer vision, numerical analysis, and quantitative research within an extensible software architecture.

**Project Status:** Active Development

---

## Overview

Financial time-series data contains noise, fluctuations, and structural changes that can make underlying patterns difficult to identify.

QuantForge investigates whether one-dimensional signals can be represented as grayscale images, processed using classical image-processing algorithms, and reconstructed for quantitative evaluation.

Image-based approaches are compared against conventional numerical methods to study reconstruction accuracy, computational cost, and their limitations.

The current research engine uses synthetic signals with known underlying trends and volatility regimes. A web-based interface allows experiments to be configured, executed, visualized, and stored for later analysis.

## Current Features

### Signal Generation
- Synthetic financial-style signal generation.
- Configurable sample count, random seed, and noise level.
- Multiple signal regimes: uptrend, downtrend, and sideways movement.

### Image-Based Signal Processing
- Conversion of one-dimensional signals into grayscale images.
- Gaussian filtering using OpenCV.
- Reconstruction of numerical signals from processed images.

### Numerical Baselines
- Moving-average filtering.
- Direct comparison between image-based and numerical approaches.

### Quantitative Evaluation
- Mean Squared Error (MSE).
- Reconstruction quality comparisons.
- Runtime measurement.
- Experiment parameter tracking.

### Experiment Management
- Persistent experiment storage using SQLite.
- Experiment history and individual experiment details.
- Aggregate statistics and MSE comparisons.
- Experiment deletion and retrieval.

### Web Application
- Interactive React and TypeScript frontend.
- FastAPI REST backend.
- Live signal preview without persisting preview requests.
- Signal Lab for configurable experiments.
- Dashboard for experiment statistics and visualization.

---

## Research Methodology

The experimental workflow consists of:

1. **Signal Generation:** Generate synthetic signals with known trends and controlled noise.
2. **Signal-to-Image Conversion:** Map numerical signals into grayscale images.
3. **Image Processing:** Apply Gaussian smoothing to the generated images.
4. **Signal Reconstruction:** Recover numerical signals from processed images.
5. **Numerical Baseline:** Apply moving-average filtering directly to the original noisy signals.
6. **Evaluation:** Compare reconstructed signals against the known clean signal using MSE and runtime measurements.
7. **Experiment Tracking:** Store experimental parameters and evaluation results for further analysis.

## Research Findings

Initial experiments indicate that the relative performance of image-based and numerical filtering depends on noise conditions and signal characteristics.

The research has explored multiple noise levels, filter parameters, random seeds, and signal regimes.

The evaluation includes held-out test seeds and paired statistical comparisons. Current results do not establish a statistically significant overall advantage for either approach after multiple-comparison correction.

An important objective is to identify where image-based processing is useful, where conventional numerical approaches perform better, and what limitations arise from the signal-to-image representation.

For detailed methodology, experimental results, and statistical analysis, see the research report in `report/report1.md` and the benchmark notebook in `experiments/benchmark.ipynb`.

---

## Technology Stack

| Component | Technologies |
|---|---|
| Programming | Python |
| Numerical Computing | NumPy |
| Image Processing | OpenCV |
| Visualization | Matplotlib, Recharts |
| Backend | FastAPI, Pydantic |
| Frontend | React, TypeScript, Vite |
| Database | SQLite, SQLAlchemy |
| Testing | pytest |
| Experiments | Jupyter Notebook |
| Version Control | Git, GitHub |

---

## Architecture

```text
                       QUANTFORGE
                           |
              +------------+------------+
              |                         |
        React Frontend            FastAPI Backend
        TypeScript                 REST API
              |                         |
       +------+------+           +------+------+
       |      |      |           |             |
   Dashboard Signal Experiments Signal API  Experiment API
              Lab                     |             |
                                      |           SQLite
                                      |
                           Python Research Engine
                                      |
                  +-------------------+-------------------+
                  |                   |                   |
             Generation         Image Pipeline       Numerical
                                                     Baselines
                  |                   |                   |
                  +-------------------+-------------------+
                                      |
                             Evaluation & Metrics
```

---

## Project Structure

```text
QuantForge/
├── backend/
│   └── app/
│       ├── api/
│       │   ├── experiments.py
│       │   └── signals.py
│       ├── db/
│       │   └── database.py
│       ├── models/
│       │   └── experiment.py
│       ├── services/
│       │   └── signal_service.py
│       └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Experiments.tsx
│   │   │   └── SignalLab.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── src/
│   ├── generate_signals.py
│   ├── signal_to_image.py
│   ├── image_pipeline.py
│   ├── recover_signal.py
│   ├── numerical_baselines.py
│   ├── evaluation.py
│   └── feature_extraction.py
│
├── tests/
├── experiments/
│   └── benchmark.ipynb
├── data/
├── outputs/
├── report/
│   ├── figures/
│   └── report1.md
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR_USERNAME/QuantForge.git
cd QuantForge
```

### 2. Set up the Python environment

```bash
python -m venv .venv
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Start the backend

From the project root:

```bash
uvicorn backend.app.main:app --reload
```

The API will be available at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 4. Start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL, usually:

`http://localhost:5173`

### 5. Run tests

From the project root:

```bash
python -m pytest -q
```

### 6. Run frontend checks

From the `frontend/` directory:

```bash
npm run lint
npm run build
```

---

## API Overview

The backend exposes REST endpoints for signal processing and experiment management.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/signals/preview` | POST | Generate a signal preview without saving an experiment |
| `/api/v1/signals/generate` | POST | Run and persist a signal experiment |
| `/api/v1/experiments/` | GET | Retrieve saved experiments |
| `/api/v1/experiments/{id}` | GET | Retrieve an individual experiment |
| `/api/v1/experiments/{id}` | DELETE | Delete an experiment |
| `/api/v1/experiments/stats` | GET | Retrieve aggregate experiment statistics |

For interactive endpoint documentation, visit `/docs` while the backend is running.

---

## Roadmap

### Research
- [x] Synthetic signal generation.
- [x] Image-based signal conversion.
- [x] Gaussian image filtering and reconstruction.
- [x] Numerical moving-average baseline.
- [x] Quantitative MSE evaluation.
- [x] Independent test evaluation.
- [x] Paired statistical comparisons.

### Application
- [x] FastAPI backend.
- [x] SQLite experiment persistence.
- [x] React-based Signal Lab.
- [x] Experiment tracking dashboard.
- [x] Live dashboard signal preview.
- [ ] Advanced experiment analytics and parameter sensitivity.

### Future Development
- [ ] Historical financial market data integration.
- [ ] Financial returns and volatility analysis.
- [ ] Backtesting engine.
- [ ] Performance profiling and optimization.
- [ ] Exploration of selected C++ components for performance-critical workloads.

---

## Scope and Disclaimer

QuantForge is an experimental research and software engineering project.

Its current experiments use synthetic financial-style signals rather than live market data. The findings are intended to study signal-processing techniques and their limitations, not to provide investment advice or trading recommendations.

---

## Author

Developed as an ongoing quantitative research and software engineering project.

**QuantForge — Exploring the intersection of signal processing, computer vision, and quantitative research.**