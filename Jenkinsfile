pipeline {
    agent any

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
                pip3 install -r heart-disease-mlops/requirements.txt
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
                sh '''
                echo "Building Docker image..."
                # Disable BuildKit for Jenkins (avoids credential issues)
                export DOCKER_BUILDKIT=0
                # Build context is heart-disease-mlops/ so all paths in Dockerfile exist
                docker build \
                -f heart-disease-mlops/Dockerfile \
                -t heart-disease-api \
                heart-disease-mlops/
                '''
            }
        }

    post {
        always {
            cleanWs()
        }
    }
}
