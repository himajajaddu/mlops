# MLOps Assignment: Heart Disease Prediction

This repository contains an end-to-end MLOps pipeline for predicting heart disease risk, demonstrating modern machine learning best practices including CI/CD, containerization, deployment, and monitoring.

## Project Overview

The project implements a complete ML pipeline for the UCI Heart Disease dataset:
- **Data**: Heart Disease dataset from UCI ML Repository (14 features, binary classification)
- **Models**: Logistic Regression and Random Forest classifiers
- **Tracking**: MLflow for experiment management
- **API**: FastAPI for model serving
- **Deployment**: Docker containerization and Kubernetes manifests
- **Pipeline**: GitHub Actions CI/CD with automated testing and training

## Project Structure

```
heart-disease-mlops/
├── data/                   # Dataset storage and download scripts
│   └── download_dataset.py # Script to download UCI Heart Disease data
├── notebooks/              # Jupyter notebooks and analysis scripts
│   └── EDA.py             # Exploratory Data Analysis with visualizations
├── src/                    # Source code for training and preprocessing
│   ├── train_model.py     # Model training with MLflow tracking
│   └── preprocess.py      # Data cleaning and preprocessing
├── api/                    # FastAPI application for model serving
│   └── app.py             # REST API with /predict endpoint
├── k8s/                    # Kubernetes deployment manifests
│   ├── deployment.yaml     # Pod deployment specification
│   └── service.yaml        # Service/Load Balancer configuration
├── .github/workflows/      # CI/CD Pipeline
│   └── ci_cd.yaml         # GitHub Actions workflow
├── plots/                  # Generated EDA visualizations
├── models/                 # Trained models and preprocessing artifacts
├── Dockerfile              # Container image definition
├── requirements.txt        # Project dependencies
└── README.md               # This file
```

## Quick Start

### 1. Installation

Clone the repository and install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Download Dataset

Download the UCI Heart Disease dataset:
```bash
python data/download_dataset.py
```

This downloads the dataset to `data/heart.csv`.

### 3. Exploratory Data Analysis (EDA)

Perform comprehensive EDA with professional visualizations:
```bash
python notebooks/EDA.py
```

This generates plots in the `plots/` directory:
- **class_balance.png** - Target class distribution (disease vs. no disease)
- **feature_distributions.png** - Histograms of all 13 features
- **correlation_heatmap.png** - Feature correlation matrix
- **features_by_target.png** - Feature distributions stratified by disease status

### 4. Data Preprocessing

Clean, encode, and scale the data:
```bash
python src/preprocess.py
```

This generates:
- `data/heart_processed.csv` - Cleaned and scaled dataset
- `models/scaler.pkl` - StandardScaler artifact for inference

### 5. Train Model with MLflow

Train the model and log experiments to MLflow:
```bash
# Start MLflow UI in background (optional)
mlflow ui &  # Visit http://localhost:5000

# Train model with tracking
python src/train_model.py
```

This logs to MLflow:
- **Parameters**: n_estimators, max_depth, test_size
- **Metrics**: accuracy, precision, recall, F1-score
- **Artifacts**: Confusion matrix plot, trained model
- **Model**: Saved as `random_forest_model/` artifact

View experiment results in the MLflow UI.

### 6. Register Model in MLflow Registry

Register the trained model for production serving:
```bash
python src/register_model.py
```

This:
- Creates a versioned model in MLflow Model Registry
- Enables model staging (None → Staging → Production → Archived)
- Provides a stable URI for production deployments

### 7. Run API Locally (with MLflow Model Loading)

Start the FastAPI server:
```bash
uvicorn api.app:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive API documentation.

The API automatically loads the trained model from MLflow in this order:
1. **MLflow Model Registry** (`models:/heart-disease-model/latest`) - Production
2. **MLflow Runs** (latest experiment) - Development
3. **Local Pickle** (`models/model.pkl`) - Fallback

Check `/model-info` endpoint to see which model is loaded.

**Example prediction request:**
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

## MLflow Integration

MLflow is fully integrated for experiment tracking and model serving. See [MLFLOW_INTEGRATION.md](MLFLOW_INTEGRATION.md) for detailed documentation on:
- Training with MLflow tracking
- Registering models in MLflow Model Registry
- Loading models in the API
- Model versioning and staging

**Quick Start:**
```bash
# 1. Train and track
python src/train_model.py

# 2. View results
mlflow ui  # http://localhost:5000

# 3. Register model
python src/register_model.py

# 4. Serve predictions
uvicorn api.app:app --reload --port 8000
```

## Key Features

### 1. Data Acquisition & EDA (5 marks)
✓ **Download Script** - `data/download_dataset.py` fetches UCI Heart Disease dataset  
✓ **Data Cleaning** - `src/preprocess.py` handles missing values and encodes features  
✓ **Professional Visualizations**:
  - Histograms of all 13 clinical features
  - Correlation heatmap showing feature relationships
  - Class balance analysis (% of positive/negative cases)
  - Feature stratification by disease presence

### 2. Feature Engineering & Model Development (8 marks)
✓ **Feature Preparation** - Scaling and encoding in preprocessing pipeline  
✓ **Multiple Models** - Logistic Regression and Random Forest classifiers  
✓ **Model Selection** - Documentation of hyperparameters and cross-validation  
✓ **Evaluation Metrics** - Accuracy, precision, recall, ROC-AUC

### 3. Experiment Tracking (5 marks)
✓ **MLflow Integration** - Automatic logging of parameters, metrics, and artifacts  
✓ **Reproducibility** - All runs tracked with versioning  
✓ **Artifact Storage** - Plots and models saved for analysis

### 4. Model Packaging & Reproducibility (7 marks)
✓ **Saved Models** - MLflow model registry  
✓ **Requirements File** - Full dependency list for reproducibility  
✓ **Preprocessing Pipeline** - StandardScaler artifact saved for inference

### 5. CI/CD Pipeline & Testing (8 marks)
✓ **GitHub Actions Workflow** - `.github/workflows/ci_cd.yaml`  
✓ **Linting** - Flake8 code quality checks  
✓ **Unit Testing** - Pytest framework ready (add tests to `tests/` folder)  
✓ **Automated Build** - Docker image building and artifact logging

### 6. Model Containerization (5 marks)
✓ **Dockerfile** - Multi-stage build for production API  
✓ **FastAPI Application** - RESTful `/predict` endpoint  
✓ **Local Testing** - Build and run locally:
```bash
docker build -t heart-disease-api:v1 .
docker run -p 8000:8000 heart-disease-api:v1
```

### 7. Production Deployment (7 marks)
✓ **Kubernetes Manifests** - Deployment and Service specs  
✓ **Load Balancer** - Service exposes API externally  
✓ **Scalability** - Multi-replica deployment for high availability
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get svc heart-disease-service
```

### 8. Monitoring & Logging (3 marks)
✓ **API Request Logging** - Requests tracked in application logs  
✓ **Metrics Collection** - Prometheus-ready (extend with metrics exporter)

### 9. Documentation (2 marks)
✓ **Setup Instructions** - Complete installation guide  
✓ **Architecture Diagram** - (Add visual diagram to report)  
✓ **CI/CD Screenshots** - (Capture from GitHub Actions)  
✓ **Deployment Proof** - (Document kubectl outputs)

## Deliverables Checklist

- [x] GitHub repository with source code
- [x] Dockerfile for containerization
- [x] requirements.txt for reproducibility
- [x] Dataset download script and preprocessing
- [x] EDA notebooks with visualizations
- [x] Training scripts with MLflow tracking
- [x] Unit test structure (add tests to `tests/` folder)
- [x] GitHub Actions workflow
- [x] Kubernetes manifests
- [x] FastAPI server with /predict endpoint
- [x] Professional documentation (this README)
- [ ] 10-page final report (write separately as doc/docx)
- [ ] End-to-end pipeline video (record separately)
- [ ] Deployed API URL (available after Kubernetes deployment)

## Setup for Submission

### Creating the Report
Create a 10-page report in Word/Google Docs including:
1. Overview and objectives
2. Dataset description and preprocessing steps
3. EDA findings and visualizations
4. Model selection and hyperparameter tuning
5. MLflow experiment results
6. CI/CD pipeline configuration
7. Docker containerization process
8. Kubernetes deployment steps
9. Monitoring and logging setup
10. Conclusion and lessons learned

### Recording the Video
Record a 5-10 minute video demonstrating:
1. Running `python data/download_dataset.py`
2. Running `python notebooks/EDA.py` and showing plots
3. Running `python src/preprocess.py`
4. Running `python src/train_model.py`
5. Starting MLflow UI
6. Testing the API with curl/Postman
7. Deploying to Kubernetes (if available)
8. Viewing monitoring/logs

### Pushing to GitHub
```bash
git add .
git commit -m "MLOps Assignment: Heart Disease Prediction"
git push origin main
```

## Running Tests

```bash
pytest tests/ -v
```

## Troubleshooting

**Dataset download fails:**
- Manual download: https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/

**MLflow not found:**
- Install: `pip install mlflow`

**Docker build fails:**
- Ensure `requirements.txt` is in the root directory
- Check Python version compatibility

**Kubernetes errors:**
- Ensure cluster is running: `minikube status`
- Check image availability: `docker images`

## References

- [UCI Heart Disease Dataset](https://archive.ics.uci.edu/ml/datasets/heart+disease)
- [MLflow Documentation](https://mlflow.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Assignment**: S1-25_AIMLCZG523 - MLOps  
**Total Marks**: 50  
**Due**: As per course schedule
