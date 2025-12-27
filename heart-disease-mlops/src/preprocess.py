"""
Data preprocessing and cleaning script.
Handles missing values, feature encoding, and scaling.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import os

def load_data(path='data/heart.csv'):
    """Load the raw heart disease dataset"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at {path}. Run data/download_dataset.py first.")
    
    df = pd.read_csv(path)
    print(f"Loaded data shape: {df.shape}")
    print(f"\nMissing values:\n{df.isnull().sum()}")
    
    return df

def handle_missing_values(df):
    """Handle missing values in the dataset"""
    print("\n--- Handling Missing Values ---")
    
    # For numeric columns, fill with median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().sum() > 0:
            median_val = df[col].median()
            df[col].fillna(median_val, inplace=True)
            print(f"Filled {col} with median: {median_val}")
    
    print("✓ Missing values handled")
    return df

def encode_features(df):
    """Encode categorical features"""
    print("\n--- Encoding Features ---")
    
    # Features that are already numeric (0/1 or 0-3 encoding)
    # sex: 0=Female, 1=Male
    # cp: 0=Typical, 1=Atypical, 2=Non-anginal, 3=Asymptomatic
    # fbs: 0=False, 1=True
    # restecg: 0=Normal, 1=ST-T abnormality, 2=LV hypertrophy
    # exang: 0=No, 1=Yes
    # slope: 0=Upsloping, 1=Flat, 2=Downsloping
    # thal: 1=Normal, 2=Fixed defect, 3=Reversible defect
    # target: 0=No disease, 1=Disease present
    
    # All features are already encoded in the UCI dataset
    # target (heart disease): convert to binary (0/1)
    df['target'] = (df['target'] > 0).astype(int)
    
    print("✓ Features encoded")
    return df

def scale_features(df, exclude_cols=['target']):
    """Scale numeric features using StandardScaler"""
    print("\n--- Scaling Features ---")
    
    # Select numeric columns to scale
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    cols_to_scale = [col for col in numeric_cols if col not in exclude_cols]
    
    scaler = StandardScaler()
    df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])
    
    print(f"Scaled {len(cols_to_scale)} features")
    
    # Save scaler for later use
    os.makedirs('models', exist_ok=True)
    import joblib
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return df, scaler

def preprocess_pipeline():
    """Complete preprocessing pipeline"""
    print("="*50)
    print("DATA PREPROCESSING PIPELINE")
    print("="*50)
    
    # Load
    df = load_data()
    
    # Clean
    df = handle_missing_values(df)
    
    # Encode
    df = encode_features(df)
    
    # Scale
    df, scaler = scale_features(df)
    
    # Save processed data
    output_path = 'data/heart_processed.csv'
    df.to_csv(output_path, index=False)
    print(f"\n✓ Processed data saved to {output_path}")
    
    print("\nProcessed data summary:")
    print(df.describe())
    
    return df

if __name__ == "__main__":
    preprocess_pipeline()
