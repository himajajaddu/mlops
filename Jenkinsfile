pipeline {
    agent any

    environment {
        MLFLOW_TRACKING_URI = 'http://127.0.0.1:5000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup Python Environment') {
            steps {
                sh '''
                python3 -m pip install --upgrade pip
                pip3 install -r requirements.txt
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'python3 -m unittest discover tests'
            }
        }

        stage('Train & Log (MLflow)') {
            steps {
                sh 'python3 heart-disease-mlops/src/train_model.py'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t heart-disease-api -f heart-disease-mlops/Dockerfile .'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
