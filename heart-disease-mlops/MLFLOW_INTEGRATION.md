# MLflow Integration Guide

This document explains how MLflow is integrated with the heart disease prediction model for experiment tracking, model registry, and serving predictions.

---

## Overview

MLflow provides three main components:

1. **Tracking** - Log parameters, metrics, and artifacts during training
2. **Registry** - Version and manage models in production
3. **Models** - Package and serve trained models

---

## Part 1: Training with MLflow Tracking

### How It Works

When you run `python src/train_model.py`, MLflow automatically logs:

```python
# 1. Set the experiment name
mlflow.set_experiment("Heart Disease Prediction")

# 2. Start a tracking run
with mlflow.start_run():
    
    # 3. Log hyperparameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 5)
    
    # 4. Train the model
    model = RandomForestClassifier(n_estimators=100, max_depth=5)
    model.fit(X_train, y_train)
    
    # 5. Log performance metrics
    accuracy = accuracy_score(y_test, y_pred)
    mlflow.log_metric("accuracy", accuracy)
    
    # 6. Log artifacts (plots, data)
    plt.savefig("plots/confusion_matrix.png")
    mlflow.log_artifact("plots/confusion_matrix.png")
    
    # 7. Log the model
    mlflow.sklearn.log_model(model, "random_forest_model")
```

### File Structure Created

```
mlruns/
├── 0/                           # Experiment ID
│   └── <run_id>/               # Unique run identifier
│       ├── params/             # Hyperparameters
│       │   ├── n_estimators
│       │   ├── max_depth
│       │   └── test_size
│       ├── metrics/            # Performance metrics
│       │   └── accuracy
│       ├── artifacts/          # Plots and data
│       │   └── confusion_matrix.png
│       └── model/              # Trained model
│           └── random_forest_model/
```

### Commands

**Run training:**
```bash
python src/train_model.py
```

**View results in MLflow UI:**
```bash
mlflow ui
```

Visit: `http://localhost:5000`

---

## Part 2: Model Registry (Versioning & Staging)

### What is Model Registry?

The Model Registry allows you to:
- **Version** - Track multiple model versions
- **Stage** - Move models through development → staging → production
- **Annotate** - Add descriptions and tags to models

### Stages

```
None → Staging → Production → Archived
```

### Register a Model

After training, register the model:

```bash
python src/register_model.py [run_id]
```

**Without run_id** (uses latest):
```bash
python src/register_model.py
```

**With specific run_id:**
```bash
python src/register_model.py abc123def456
```

This creates a registered model: `heart-disease-model`

### View Registered Models

In MLflow UI, click "Models" → "heart-disease-model" to see:
- All versions (v1, v2, v3, ...)
- Current stages (None, Staging, Production)
- Model details and artifacts

### Transition Stages

Move a model to different stages for testing and production:

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Move v1 to Staging for testing
client.transition_model_version_stage(
    name="heart-disease-model",
    version=1,
    stage="Staging"
)

# Move v1 to Production after testing
client.transition_model_version_stage(
    name="heart-disease-model",
    version=1,
    stage="Production"
)
```

---

## Part 3: Loading Models from MLflow

### In the API

The API (`api/app.py`) automatically loads models in this priority order:

1. **MLflow Model Registry** (production-ready)
2. **MLflow Runs** (latest experiment run)
3. **Local Pickle** (fallback)

```python
def load_model_from_mlflow():
    # Method 1: Load from MLflow Model Registry
    model_uri = "models:/heart-disease-model/latest"
    model = mlflow.sklearn.load_model(model_uri)
    
    # Method 2: Load from latest MLflow run
    runs = mlflow.search_runs(experiment_names=["Heart Disease Prediction"])
    model_uri = f"runs:/{run_id}/random_forest_model"
    model = mlflow.sklearn.load_model(model_uri)
    
    # Method 3: Load from local pickle
    model = joblib.load("models/model.pkl")
```

### Running the API

```bash
# Start the API server
uvicorn api.app:app --reload --port 8000

# Visit: http://localhost:8000/docs for interactive API docs
```

### Making Predictions

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

Response:
```json
{
  "prediction": 1,
  "confidence": 0.87,
  "risk_level": "High",
  "model_version": "registry-latest"
}
```

---

## Complete Workflow

### 1. Train Model with Tracking

```bash
# Download data
python data/download_dataset.py

# Preprocess
python src/preprocess.py

# Train with MLflow tracking
python src/train_model.py
```

**Output:** `mlruns/0/<run_id>/` with logged params, metrics, and model

### 2. Register Model

```bash
# Register the trained model
python src/register_model.py

# View in MLflow UI
mlflow ui  # Visit http://localhost:5000
```

### 3. Serve Predictions

```bash
# Start API server
uvicorn api.app:app --reload --port 8000

# Test prediction
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"age": 54, "sex": 1, ...'
```

---

## MLflow Model URI Formats

| URI | Location | Use Case |
|-----|----------|----------|
| `runs:/{run_id}/model_name` | Single MLflow run | Development, debugging |
| `models:/model_name/latest` | Model Registry (latest) | Production serving |
| `models:/model_name/1` | Specific version | Version pinning |
| `models:/model_name/Staging` | Staging stage | Pre-production testing |
| `models:/model_name/Production` | Production stage | Live predictions |

---

## MLflow Tracking Backend Options

By default, MLflow stores data locally in `mlruns/`. For production, use:

### SQLite (Lightweight)
```bash
export MLFLOW_TRACKING_URI="sqlite:///mlflow.db"
mlflow ui
```

### PostgreSQL (Production)
```bash
export MLFLOW_TRACKING_URI="postgresql://user:password@localhost/mlflow"
mlflow ui
```

### Databricks (Cloud)
```bash
export MLFLOW_TRACKING_URI="databricks"
mlflow ui
```

---

## Key Commands Summary

```bash
# Start MLflow UI
mlflow ui

# Train model with tracking
python src/train_model.py

# Register trained model
python src/register_model.py

# Start API server
uvicorn api.app:app --reload --port 8000

# Test prediction
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d '{...}'

# List registered models
python -c "from mlflow.tracking import MlflowClient; print(MlflowClient().search_registered_models())"

# Get model URI
mlflow models list
```

---

## Troubleshooting

### Model not loading

**Problem:** "Model not loaded. Service unavailable."

**Solution:**
1. Train a model: `python src/train_model.py`
2. Check `mlruns/` directory exists
3. Restart API server

### MLflow UI shows no experiments

**Problem:** MLflow UI empty

**Solution:**
```bash
# Check tracking URI
echo $MLFLOW_TRACKING_URI

# Default is ./mlruns (local)
# If using remote, configure env variable
export MLFLOW_TRACKING_URI="sqlite:///mlflow.db"
```

### Model registry errors

**Problem:** "MlflowException: Registered model already exists"

**Solution:** This is normal when registering the same model multiple times. MLflow will create a new version automatically.

---

## Next Steps

1. **Track more metrics** - Add precision, recall, F1-score
2. **Compare runs** - MLflow UI shows side-by-side comparison
3. **Model aliases** - Use "champion" alias for best model
4. **Webhook integration** - Trigger deployments on stage transitions
5. **Remote tracking** - Use PostgreSQL/S3 for production scale

---

For more information, see [MLflow Documentation](https://mlflow.org/docs/)
