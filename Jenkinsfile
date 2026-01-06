pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY = 'heart-disease-api'
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        MLFLOW_TRACKING_URI = 'http://127.0.0.1:5000/' // Update with your MLflow server URL
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh 'python3 -m unittest discover tests'
            }
        }

        stage('Train & Register (MLflow)') {
            steps {
                script {
                    sh "python3 heart-disease-mlops/src/train_model.py"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    sh "docker build -t ${ECR_REPOSITORY}:latest -f heart-disease-mlops/Dockerfile ."
                    sh "docker tag ${ECR_REPOSITORY}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
                }
            }
        }

        stage('Push to ECR') {
            steps {
                sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh "aws ecs update-service --cluster heart-disease-cluster --service heart-disease-service --force-new-deployment"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
