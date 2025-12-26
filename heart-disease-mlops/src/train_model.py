import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
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
    
    # Set experiment name
    mlflow.set_experiment("Heart Disease Prediction")
    
    # Enable autologging (captures params, metrics, and model artifacts automatically)
    # mlflow.sklearn.autolog() 
    # Note: We are doing manual logging below to demonstrate "how it is done" as requested.
    
    with mlflow.start_run():
        print("Starting training run...")
        
        # 1. Log Parameters
        n_estimators = 100
        max_depth = 5
        mlflow.log_param("n_estimators", n_estimators)
        mlflow.log_param("max_depth", max_depth)
        mlflow.log_param("test_size", 0.2)
        
        clf = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=42)
        clf.fit(X_train, y_train)
        
        # Predict
        y_pred = clf.predict(X_test)
        
        # 2. Log Metrics
        accuracy = accuracy_score(y_test, y_pred)
        mlflow.log_metric("accuracy", accuracy)
        print(f"Model Accuracy: {accuracy}")
        
        # 3. Log Artifacts (Plots)
        # Generate Confusion Matrix Plot
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        
        # Save plot locally first
        os.makedirs("plots", exist_ok=True)
        plot_path = "plots/confusion_matrix.png"
        plt.savefig(plot_path)
        plt.close()
        
        # Log the plot artifact to MLflow
        mlflow.log_artifact(plot_path)
        
        # 4. Log Model
        mlflow.sklearn.log_model(clf, "random_forest_model")
        
        print("Run complete. Check MLflow UI for details.")

if __name__ == "__main__":
    train()
