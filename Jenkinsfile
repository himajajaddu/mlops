pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY = 'heart-disease-api'
        // These are names of the secrets you MUST create in Jenkins as "Secret Text"
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')
        MLFLOW_TRACKING_URI = 'http://127.0.0.1:5000/' 
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
                sh "python3 heart-disease-mlops/src/train_model.py"
            }
        }

        stage('Build & Push') {
            steps {
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                sh "docker build -t ${ECR_REPOSITORY}:latest -f heart-disease-mlops/Dockerfile ."
                sh "docker tag ${ECR_REPOSITORY}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
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
            node('built-in') {
                cleanWs()
            }
        }
    }
}
