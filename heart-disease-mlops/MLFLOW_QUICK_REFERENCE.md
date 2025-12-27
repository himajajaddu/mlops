# MLflow Integration - Quick Reference

## What is MLflow?

MLflow tracks machine learning experiments and manages model lifecycle:

```
Training Code
     ↓
MLflow Tracking (logs parameters, metrics, artifacts)
     ↓
MLflow Experiment Dashboard (view & compare runs)
     ↓
MLflow Model Registry (version & stage models)
     ↓
API Server (loads model for predictions)
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING PHASE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Download Data          2. EDA                          │
│  ┌──────────────────┐     ┌─────────────────┐             │
│  │download_dataset  │     │EDA.py           │             │
│  │   .py            │     │- Histograms     │             │
│  └────────┬─────────┘     │- Heatmaps       │             │
│           │               │- Visualizations │             │
│           ▼               └────────┬────────┘             │
│  data/heart.csv                    │                      │
│                                    ▼                      │
│                      plots/ (visualizations)             │
│                                                          │
│  3. Preprocess          4. Train with MLflow            │
│  ┌──────────────────┐   ┌────────────────────┐          │
│  │preprocess.py     │   │train_model.py      │          │
│  │- Handle missing  │   │- MLflow tracking   │          │
│  │- Encode features │   │- Log params        │          │
│  │- Scale data      │   │- Log metrics       │          │
│  └────────┬─────────┘   │- Log artifacts     │          │
│           │             │- Log model         │          │
│           ▼             └────────┬───────────┘          │
│  data/heart_processed  │         │                      │
│  models/scaler.pkl      │         ▼                      │
│                         │   mlruns/0/ (Local DB)        │
│                         │   ├── params/                 │
│                         │   ├── metrics/                │
│                         │   ├── artifacts/              │
│                         │   └── model/                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              MODEL REGISTRY & SERVING PHASE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  5. Register Model          6. Serve Predictions           │
│  ┌──────────────────────┐   ┌──────────────────────┐      │
│  │register_model.py     │   │api/app.py            │      │
│  │- Register to registry│   │- Load model from:    │      │
│  │- Enable versioning   │   │  1) Model Registry   │      │
│  │- Enable staging      │   │  2) MLflow Runs      │      │
│  └────────┬─────────────┘   │  3) Local pickle     │      │
│           │                 │- Make predictions    │      │
│           ▼                 │- Return results      │      │
│  heart-disease-model        └──────────┬───────────┘      │
│  (v1, v2, v3, ...)                    │                 │
│  Stages: None|Staging|Prod             │                 │
│                                         ▼                │
│                              HTTP Requests:             │
│                              POST /predict              │
│                              GET /model-info            │
│                              GET /health                │
│                                                          │
│  7. Monitor & Compare                                   │
│  ┌──────────────────────┐                              │
│  │mlflow ui             │                              │
│  │ (Dashboard)          │                              │
│  │ - Experiments        │                              │
│  │ - Runs & Metrics     │                              │
│  │ - Model Registry     │                              │
│  │ - Artifacts          │                              │
│  └──────────────────────┘                              │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Complete Workflow

### 1️⃣ **Train & Track** (Generate experiment data)
```bash
# Download data
python data/download_dataset.py

# Analyze data
python notebooks/EDA.py

# Preprocess
python src/preprocess.py

# Train with MLflow tracking
python src/train_model.py
```

**Creates:** `mlruns/0/<run_id>/` with params, metrics, artifacts, and model

---

### 2️⃣ **Register Model** (Add to MLflow Model Registry)
```bash
# Register the trained model
python src/register_model.py

# View in MLflow UI
mlflow ui  # http://localhost:5000
```

**Creates:** Versioned model `heart-disease-model/v1` in registry

---

### 3️⃣ **Serve Predictions** (Load model and serve API)
```bash
# Start API server
uvicorn api.app:app --reload --port 8000
```

**API loads model in this order:**
1. MLflow Model Registry (`models:/heart-disease-model/latest`)
2. Latest MLflow Run (`runs:/{run_id}/random_forest_model`)
3. Local Pickle (`models/model.pkl`)

---

### 4️⃣ **Make Predictions** (Use the API)
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 54,
    "sex": 1,
    "cp": 0,
    "trestbps": 120,
    "chol": 240,
    "fbs": 0,
    "restecg": 0,
    "thalach": 160,
    "exang": 0,
    "oldpeak": 0.0,
    "slope": 1,
    "ca": 0,
    "thal": 2
  }'
```

**Response:**
```json
{
  "prediction": 1,
  "confidence": 0.87,
  "risk_level": "High",
  "model_version": "registry-latest"
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/train_model.py` | Train model with MLflow tracking |
| `src/register_model.py` | Register model in MLflow registry |
| `api/app.py` | FastAPI server with MLflow model loading |
| `MLFLOW_INTEGRATION.md` | Detailed integration guide |
| `mlruns/` | Local MLflow database (auto-created) |

---

## MLflow Concepts

### **Tracking** (Experiment Logging)
```python
mlflow.set_experiment("Heart Disease Prediction")
with mlflow.start_run():
    mlflow.log_param("n_estimators", 100)
    mlflow.log_metric("accuracy", 0.92)
    mlflow.log_artifact("plots/confusion_matrix.png")
    mlflow.sklearn.log_model(model, "random_forest_model")
```

**Output:** Run data stored in `mlruns/0/<run_id>/`

---

### **Model Registry** (Model Management)
```python
mlflow.register_model("runs:/<run_id>/model", "heart-disease-model")
```

**Creates:** Versioned model with lifecycle:
- `None` → `Staging` → `Production` → `Archived`

---

### **Loading Models** (For Serving)
```python
# From Registry (Production)
model = mlflow.sklearn.load_model("models:/heart-disease-model/latest")

# From Run (Development)
model = mlflow.sklearn.load_model("runs:/<run_id>/random_forest_model")

# From Local (Fallback)
model = joblib.load("models/model.pkl")
```

---

## Automated Pipeline Script

```bash
bash run_pipeline.sh
```

Runs the complete pipeline:
1. Download data
2. Run EDA
3. Preprocess
4. Train with MLflow
5. Register model
6. Start API server

---

## One-Liner Quick Start

```bash
# Terminal 1: Complete pipeline
bash run_pipeline.sh

# Terminal 2: View MLflow UI
mlflow ui

# Terminal 3: Test prediction
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"age": 54, "sex": 1, "cp": 0, "trestbps": 120, "chol": 240, "fbs": 0, "restecg": 0, "thalach": 160, "exang": 0, "oldpeak": 0.0, "slope": 1, "ca": 0, "thal": 2}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not loading | Run `python src/train_model.py` first |
| MLflow UI empty | Check `mlruns/` directory exists |
| Port 5000/8000 in use | Use different port: `--port 5001` |
| Model Registry errors | Run: `python src/register_model.py` |

---

For detailed documentation, see [MLFLOW_INTEGRATION.md](MLFLOW_INTEGRATION.md)
