# MLOps Assignment: Heart Disease Prediction (Local MacBook Pipeline)

This repository contains an end-to-end MLOps pipeline for predicting heart disease risk, specifically optimized for running on a local MacBook environment with Jenkins and Docker.

## Project Overview

The project implements a complete ML pipeline for the UCI Heart Disease dataset:
- **Data**: Heart Disease dataset from UCI ML Repository
- **Models**: Logistic Regression and Random Forest classifiers
- **Tracking**: MLflow for experiment management
- **API**: FastAPI for model serving
- **Deployment**: Local Docker engine pushing to AWS ECR and updating ECS
- **Automation**: Local Jenkins pipeline triggered by GitHub webhooks

## Project Structure

```
.
├── heart-disease-mlops/   # Core ML assignment folder
│   ├── data/              # Dataset storage and download scripts
│   ├── notebooks/         # EDA and analysis scripts
│   ├── src/               # Source code for training and preprocessing
│   ├── api/               # FastAPI application for model serving
│   ├── k8s/               # Kubernetes manifests (optional/reference)
│   ├── Dockerfile         # Container image definition
│   ├── Jenkinsfile        # Local Jenkins automation script
│   ├── requirements.txt   # Python dependencies
│   └── STUDENT_MASTER_GUIDE.md # Detailed step-by-step local setup guide
├── tests/                 # Automated unit tests
└── replit.md              # Project metadata
```

## Quick Start (Local MacBook)

### 1. Environment Setup
Follow the detailed instructions in `heart-disease-mlops/STUDENT_MASTER_GUIDE.md` to install:
*   Docker Desktop
*   Jenkins (Local)
*   AWS CLI (Configured with Access Keys)
*   ngrok (For GitHub webhook tunneling)

### 2. Manual Execution
If you want to run steps manually:
```bash
# Install dependencies
pip install -r heart-disease-mlops/requirements.txt

# Download and preprocess
python heart-disease-mlops/data/download_dataset.py
python heart-disease-mlops/src/preprocess.py

# Train and Track
mlflow ui &
python heart-disease-mlops/src/train_model.py
```

### 3. Automated CI/CD
1.  Start your local Jenkins and ngrok.
2.  Configure a GitHub webhook to your ngrok URL.
3.  Push a code change to GitHub.
4.  Jenkins will automatically:
    *   Run tests in `tests/`
    *   Train and register the best model in MLflow
    *   Build a Docker image
    *   Push to AWS ECR
    *   Update your AWS ECS Service

## Key Features

*   **Local-First MLOps**: Optimized for students using their own hardware as a build server.
*   **Model Registry**: Automatically promotes and registers models that beat previous metrics.
*   **Secure Credentials**: Uses Jenkins Credentials Manager and local AWS config (no secrets in code).
*   **Automated Testing**: Integrated `unittest` suite that blocks bad deployments.

## Troubleshooting
Refer to the troubleshooting section in `heart-disease-mlops/STUDENT_MASTER_GUIDE.md` for Mac-specific issues.
