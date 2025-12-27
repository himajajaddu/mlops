"""
Download the UCI Heart Disease dataset.
This script downloads the Heart Disease dataset from the UCI Machine Learning Repository
and saves it to data/heart.csv
"""

import pandas as pd
import os

def download_heart_dataset():
    """Download heart disease dataset from UCI repository"""
    
    # URL to the UCI Heart Disease dataset
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    
    # Column names as per UCI documentation
    columns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ]
    
    try:
        print("Downloading Heart Disease dataset from UCI repository...")
        # Read the dataset
        df = pd.read_csv(url, names=columns, na_values='?')
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Save to CSV
        output_path = 'data/heart.csv'
        df.to_csv(output_path, index=False)
        
        print(f"✓ Dataset downloaded successfully and saved to {output_path}")
        print(f"  Shape: {df.shape}")
        print(f"  Missing values: {df.isnull().sum().sum()}")
        
        return df
    
    except Exception as e:
        print(f"✗ Error downloading dataset: {e}")
        print("Please manually download from: https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/")
        return None

if __name__ == "__main__":
    download_heart_dataset()
