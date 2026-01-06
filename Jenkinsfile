pipeline {
    agent any

    environment {
        # Optional: MLflow tracking server URL
        MLFLOW_TRACKING_URI = 'http://127.0.0.1:5000'
        # Docker buildkit off (avoids macOS Jenkins/container issues)
        DOCKER_BUILDKIT = "0"
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

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                # Use absolute paths for Jenkins workspace to avoid empty context
                docker build \
                  -f ${WORKSPACE}/heart-disease-mlops/Dockerfile \
                  -t heart-disease-api \
                  ${WORKSPACE}/heart-disease-mlops/
                '''
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline finished successfully!"
        }
        failure {
            echo "Pipeline failed. Check console output."
        }
    }
}
