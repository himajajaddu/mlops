from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
import joblib
import os
from typing import Optional

app = FastAPI(
    title="Heart Disease Prediction API",
    description="MLflow-integrated API for heart disease prediction"
)

# Define input data model
class PatientData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

class PredictionResponse(BaseModel):
    prediction: int
    confidence: float
    risk_level: str
    model_version: str

# Global variables for model and scaler
MODEL = None
SCALER = None
MODEL_VERSION = "unknown"

def load_model_from_mlflow():
    """
    Load the latest model from MLflow.
    Tries multiple sources:
    1. MLflow Model Registry (production)
    2. MLflow runs directory (latest run)
    3. Local pickle file (fallback)
    """
    global MODEL, MODEL_VERSION
    
    try:
        # Method 1: Load from MLflow Model Registry
        print("Attempting to load model from MLflow Model Registry...")
        model_uri = "models:/heart-disease-model/latest"
        MODEL = mlflow.sklearn.load_model(model_uri)
        MODEL_VERSION = "registry-latest"
        print(f"✓ Loaded model from registry: {model_uri}")
        return True
    except Exception as e:
        print(f"Model Registry not available: {e}")
    
    try:
        # Method 2: Load from latest MLflow run
        print("Attempting to load model from latest MLflow run...")
        mlflow.set_experiment("Heart Disease Prediction")
        
        # Get the latest run
        runs = mlflow.search_runs(
            experiment_names=["Heart Disease Prediction"],
            order_by=["start_time DESC"],
            max_results=1
        )
        
        if len(runs) > 0:
            run_id = runs.iloc[0]["run_id"]
            model_uri = f"runs:/{run_id}/random_forest_model"
            MODEL = mlflow.sklearn.load_model(model_uri)
            MODEL_VERSION = f"run-{run_id[:8]}"
            print(f"✓ Loaded model from run: {run_id}")
            return True
    except Exception as e:
        print(f"MLflow runs not available: {e}")
    
    try:
        # Method 3: Load from local pickle file (fallback)
        print("Attempting to load model from local file...")
        if os.path.exists("models/model.pkl"):
            MODEL = joblib.load("models/model.pkl")
            MODEL_VERSION = "local-pickle"
            print("✓ Loaded model from local pickle file")
            return True
    except Exception as e:
        print(f"Local model file not available: {e}")
    
    print("✗ Could not load model from any source")
    return False

def load_scaler_from_file():
    """Load the StandardScaler used during preprocessing"""
    global SCALER
    
    try:
        if os.path.exists("models/scaler.pkl"):
            SCALER = joblib.load("models/scaler.pkl")
            print("✓ Loaded scaler from file")
            return True
    except Exception as e:
        print(f"Could not load scaler: {e}")
    
    print("⚠ Scaler not available, predictions will not be scaled")
    return False

@app.on_event("startup")
async def startup_event():
    """Load model and scaler when API starts"""
    print("\n" + "="*60)
    print("Starting Heart Disease Prediction API")
    print("="*60)
    
    load_model_from_mlflow()
    load_scaler_from_file()
    
    if MODEL is None:
        print("⚠ WARNING: Model not loaded. Predictions may fail.")
    print("="*60 + "\n")

@app.get("/")
def home():
    return {
        "message": "Heart Disease Prediction API is running",
        "model_loaded": MODEL is not None,
        "model_version": MODEL_VERSION
    }

@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_available": MODEL is not None,
        "model_version": MODEL_VERSION
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PatientData):
    """
    Make a heart disease prediction.
    
    Returns:
    - prediction: 1 = disease present, 0 = no disease
    - confidence: prediction confidence (0-1)
    - risk_level: categorical risk assessment
    - model_version: which model was used
    """
    
    if MODEL is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Service unavailable."
        )
    
    try:
        # Convert input to dataframe (same format used in training)
        input_data = pd.DataFrame([data.dict()])
        
        # Scale the features if scaler is available
        if SCALER is not None:
            feature_cols = [col for col in input_data.columns]
            input_data[feature_cols] = SCALER.transform(input_data[feature_cols])
        
        # Make prediction
        prediction = MODEL.predict(input_data)[0]
        
        # Get prediction probability if available
        try:
            probabilities = MODEL.predict_proba(input_data)[0]
            confidence = float(max(probabilities))
        except AttributeError:
            # Model doesn't have predict_proba
            confidence = 0.5
        
        # Determine risk level
        if prediction == 1:
            risk_level = "High" if confidence > 0.7 else "Moderate"
        else:
            risk_level = "Low"
        
        return PredictionResponse(
            prediction=int(prediction),
            confidence=confidence,
            risk_level=risk_level,
            model_version=MODEL_VERSION
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/model-info")
def model_info():
    """Get information about the loaded model"""
    return {
        "model_loaded": MODEL is not None,
        "model_version": MODEL_VERSION,
        "model_type": type(MODEL).__name__ if MODEL else None,
        "scaler_available": SCALER is not None,
        "features_expected": 13
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
