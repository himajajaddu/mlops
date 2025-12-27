"""
Register a trained model in MLflow Model Registry.
This allows for model versioning, staging, and production deployment.
"""

import mlflow
import mlflow.sklearn
import sys

def register_model(run_id: str = None, model_name: str = "heart-disease-model"):
    """
    Register a model from MLflow run to the Model Registry.
    
    Args:
        run_id: The MLflow run ID containing the model (if None, uses latest run)
        model_name: Name to register the model under
    
    Returns:
        ModelVersion object with registration details
    """
    
    print("="*60)
    print("MLflow Model Registry - Model Registration")
    print("="*60)
    
    # If no run_id provided, get the latest run
    if run_id is None:
        print("\nFinding latest model run...")
        mlflow.set_experiment("Heart Disease Prediction")
        
        runs = mlflow.search_runs(
            experiment_names=["Heart Disease Prediction"],
            order_by=["start_time DESC"],
            max_results=1
        )
        
        if len(runs) == 0:
            print("✗ No runs found. Please train a model first.")
            return None
        
        run_id = runs.iloc[0]["run_id"]
        print(f"✓ Found latest run: {run_id}")
    
    try:
        # Register the model
        model_uri = f"runs:/{run_id}/random_forest_model"
        
        print(f"\nRegistering model from: {model_uri}")
        print(f"Model name: {model_name}")
        
        model_version = mlflow.register_model(
            model_uri=model_uri,
            name=model_name
        )
        
        print(f"✓ Model registered successfully!")
        print(f"  - Model Name: {model_version.name}")
        print(f"  - Version: {model_version.version}")
        print(f"  - Stage: {model_version.current_stage}")
        
        return model_version
    
    except mlflow.exceptions.MlflowException as e:
        if "already exists" in str(e):
            print(f"⚠ Model '{model_name}' already registered (creating new version)")
            
            # Get the new version
            model_version = mlflow.register_model(
                model_uri=model_uri,
                name=model_name
            )
            print(f"✓ New version created: {model_version.version}")
            
            return model_version
        else:
            print(f"✗ Registration failed: {e}")
            return None

def transition_model_stage(model_name: str, version: int, stage: str):
    """
    Transition a model version to a different stage.
    Stages: None -> Staging -> Production -> Archived
    
    Args:
        model_name: Name of the registered model
        version: Version number
        stage: Target stage ("Staging", "Production", "Archived")
    """
    
    print(f"\nTransitioning {model_name} v{version} to {stage}...")
    
    try:
        client = mlflow.tracking.MlflowClient()
        client.transition_model_version_stage(
            name=model_name,
            version=version,
            stage=stage
        )
        
        print(f"✓ Transitioned to {stage}")
    except Exception as e:
        print(f"✗ Transition failed: {e}")

def list_registered_models():
    """List all registered models in the registry"""
    
    print("\n" + "="*60)
    print("Registered Models in MLflow Registry")
    print("="*60 + "\n")
    
    try:
        client = mlflow.tracking.MlflowClient()
        models = client.search_registered_models()
        
        if len(models) == 0:
            print("No models registered yet.")
            return
        
        for model in models:
            print(f"📦 {model.name}")
            print(f"   Latest version: {model.latest_versions[0].version}")
            print(f"   Current stage: {model.latest_versions[0].current_stage}")
            print()
    
    except Exception as e:
        print(f"✗ Error listing models: {e}")

if __name__ == "__main__":
    
    # Example usage:
    # python src/register_model.py [run_id] [action]
    
    if len(sys.argv) > 1:
        run_id = sys.argv[1]
    else:
        run_id = None
    
    # Register the model
    model_version = register_model(run_id)
    
    if model_version:
        # Optionally transition to Staging for testing
        # transition_model_stage(model_version.name, model_version.version, "Staging")
        
        # List all registered models
        list_registered_models()
    
    print("\n" + "="*60)
    print("To load and serve the model, run:")
    print("  uvicorn api.app:app --reload --port 8000")
    print("="*60)
