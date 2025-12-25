import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import mlflow
import mlflow.sklearn
import os

# Create dummy data if not exists for demonstration
def create_dummy_data():
    if not os.path.exists('data/heart.csv'):
        os.makedirs('data', exist_ok=True)
        print("Creating dummy dataset...")
        # Columns from UCI Heart Disease dataset
        cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
                'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
        data = np.random.rand(100, 14)
        df = pd.DataFrame(data, columns=cols)
        df['target'] = np.random.randint(0, 2, 100)
        df.to_csv('data/heart.csv', index=False)

def train():
    create_dummy_data()
    
    # Load Data
    df = pd.read_csv('data/heart.csv')
    X = df.drop('target', axis=1)
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Enable MLflow autologging
    mlflow.set_experiment("Heart Disease Prediction")
    mlflow.sklearn.autolog()
    
    with mlflow.start_run():
        print("Training model...")
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train, y_train)
        
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model Accuracy: {accuracy}")
        print(classification_report(y_test, y_pred))
        
        # Log model
        mlflow.sklearn.log_model(clf, "random_forest_model")

if __name__ == "__main__":
    train()
