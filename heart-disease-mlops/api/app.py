from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
import os

app = FastAPI(title="Heart Disease Prediction API")

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

# Mock model loading (replace with actual model loading logic)
# model = pickle.load(open("model.pkl", "rb"))

@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API is running"}

@app.post("/predict")
def predict(data: PatientData):
    # Convert input to dataframe
    input_data = pd.DataFrame([data.dict()])
    
    # Placeholder prediction logic (Replace with model.predict(input_data))
    # risk = model.predict(input_data)[0]
    # prob = model.predict_proba(input_data)[0][1]
    
    # Simple heuristic for demo
    risk_score = 0.0
    if data.age > 50: risk_score += 0.3
    if data.chol > 240: risk_score += 0.3
    
    prediction = 1 if risk_score > 0.5 else 0
    confidence = min(0.95, risk_score + 0.1) if prediction == 1 else 0.8
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "risk_level": "High" if prediction == 1 else "Low"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
