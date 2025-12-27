#!/bin/bash

# Complete MLOps Pipeline - Heart Disease Prediction
# This script runs the entire pipeline from data to API

set -e  # Exit on error

echo "=================================="
echo "MLOps Pipeline - Heart Disease Prediction"
echo "=================================="

# Step 1: Download Data
echo -e "\n[1/6] Downloading dataset..."
python data/download_dataset.py

# Step 2: EDA
echo -e "\n[2/6] Running Exploratory Data Analysis..."
python notebooks/EDA.py

# Step 3: Preprocessing
echo -e "\n[3/6] Preprocessing data..."
python src/preprocess.py

# Step 4: Training
echo -e "\n[4/6] Training model with MLflow tracking..."
python src/train_model.py

# Step 5: Register Model
echo -e "\n[5/6] Registering model in MLflow Registry..."
python src/register_model.py

# Step 6: Start API
echo -e "\n[6/6] Starting FastAPI server..."
echo "Visit http://localhost:8000/docs for API documentation"
echo "Make predictions at POST http://localhost:8000/predict"
echo ""
echo "In another terminal, view MLflow UI:"
echo "  mlflow ui"
echo ""

uvicorn api.app:app --reload --port 8000
