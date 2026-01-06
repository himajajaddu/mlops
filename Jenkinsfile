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
                echo "Skipping Docker build — using local image: ${LOCAL_IMAGE}"
            }
        }

        stage('AWS Login to ECR') {
            steps {
                echo "Logging into AWS ECR..."
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag Local Image for ECR') {
            steps {
                echo "Tagging local Docker image for ECR..."
                sh """
                docker tag ${LOCAL_IMAGE} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Image to ECR') {
            steps {
                echo "Pushing Docker image to ECR..."
                sh """
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to ECS') {
            steps {
                echo "Deploying new image to ECS..."
                sh """
                aws ecs update-service \
                  --cluster ${ECS_CLUSTER} \
                  --service ${ECS_SERVICE} \
                  --force-new-deployment \
                  --region ${AWS_REGION}
                """
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
