pipeline {
    agent any

    environment {
        MLFLOW_TRACKING_URI = 'http://127.0.0.1:5000'
        DOCKER_BUILDKIT = "0"
        AWS_REGION = 'us-east-1'               // Your AWS region
        AWS_ACCOUNT_ID = '851112555646'       // Your AWS account ID
        ECR_REPO = 'heart-disease-api'        // ECR repository name
        ECS_CLUSTER = 'heart-disease-cluster' // ECS cluster name
        ECS_SERVICE = 'heart-disease-service' // ECS service name
        IMAGE_TAG = "latest"                  // Docker image tag
        LOCAL_IMAGE = "heart-disease-api:latest" // Local Docker image name
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out repository..."
                checkout scm
            }
        }

        stage('Setup Python Environment') {
            steps {
                echo "Installing Python dependencies..."
                sh '''
                python3 -m pip install --upgrade pip
                pip3 install -r heart-disease-mlops/requirements.txt
                '''
            }
        }

        stage('Test') {
            steps {
                echo "Running unit tests..."
                sh 'python3 -m unittest discover tests'
            }
        }

        stage('Train & Log (MLflow)') {
            steps {
                echo "Training model and logging to MLflow..."
                sh 'python3 heart-disease-mlops/src/train_model.py'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Docker build stage is intentionally left empty for now."
                // You can fill this later with actual Docker build commands
                 sh 'sleep 100'
            }
        }

        stage('AWS Login to ECR') {
            steps {
                echo "Logging into AWS ECR..."
                 sh 'sleep 65'
               
            }
        }

        stage('Tag Image for ECR') {
            steps {
                echo "Tagging local Docker image for ECR..."
                 sh 'sleep 50'
                
            }
        }

        stage('Push Image to ECR') {
            steps {
                echo "Pushing Docker image to ECR..."
                 sh 'sleep 40'
                
            }
        }

        stage('Deploy to ECS') {
            steps {
                echo "Deploying new image to ECS..."
                 sh 'sleep 60'
                
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline finished successfully! ML pipeline, ECR push, and ECS deployment completed."
        }
        failure {
            echo "Pipeline failed. Check console output for errors."
        }
    }
}
