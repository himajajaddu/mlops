# MLOps Assignment: Heart Disease Prediction

This repository contains an end-to-end MLOps pipeline for predicting heart disease risk.

## Project Structure

```
heart-disease-mlops/
├── api/                # FastAPI application for model serving
├── data/               # Dataset storage (scripts to download)
├── k8s/                # Kubernetes manifests for deployment
├── notebooks/          # Jupyter notebooks for EDA
├── src/                # Source code for training and preprocessing
├── .github/workflows/  # CI/CD Pipeline
├── Dockerfile          # Container configuration
├── requirements.txt    # Project dependencies
└── README.md           # This file
```

## 1. Setup & Installation

### Prerequisites
- Python 3.9+
- Docker
- Kubernetes (Minikube or Cloud Provider)

### Installation
```bash
pip install -r requirements.txt
```

## 2. Training the Model

To train the model and log experiments to MLflow:

```bash
python src/train_model.py
```
This will:
1. Load data from `data/heart.csv` (ensure you download it first)
2. Preprocess features
3. Train a Random Forest Classifier
4. Log metrics and artifacts to MLflow

## 3. Running the API Locally

```bash
uvicorn api.app:app --reload
```
Visit `http://localhost:8000/docs` to test the API.

## 4. Docker Build

```bash
docker build -t heart-disease-api:v1 .
docker run -p 8000:8000 heart-disease-api:v1
```

## 5. Deployment

Deploy to Kubernetes:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## CI/CD Pipeline
The GitHub Actions workflow in `.github/workflows/ci_cd.yaml` automatically:
1. Lints code with Flake8
2. Runs unit tests
3. Builds the Docker image
4. Pushes to container registry (configured in secrets)
