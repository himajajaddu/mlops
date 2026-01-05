# GitHub to Cloud Automation Guide

This document explains how to set up the automation so that every commit to GitHub triggers a deployment to your AWS account using Jenkins.

---

## 🔗 Step 1: Connect GitHub to Jenkins

### 1. Create a Webhook in GitHub
1. Go to your GitHub repository.
2. Click **Settings** -> **Webhooks** -> **Add webhook**.
3. **Payload URL**: `http://your-jenkins-ip:8080/github-webhook/`
4. **Content type**: `application/json`
5. **Which events**: Select "Just the push event".
6. Click **Add webhook**.

### 2. Configure Jenkins to Listen
1. In your Jenkins job (`heart-disease-mlops`), go to **Configure**.
2. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling**.
3. Save the configuration.

---

## 🛠 Step 2: Configure the Pipeline (Jenkinsfile)

Your `Jenkinsfile` is already set up to handle the CI/CD flow. When GitHub notifies Jenkins of a new commit, Jenkins will:
1. **Pull** the latest code.
2. **Test** the code (Linting & Pytest).
3. **Build** a new Docker image.
4. **Push** the image to Amazon ECR.
5. **Deploy** to your cloud infrastructure (EKS or EC2).

---

## 🚀 Step 3: Deployment Logic

Ensure your `Jenkinsfile` in `heart-disease-mlops/Jenkinsfile` has the correct deployment commands for your environment.

### For AWS EKS (Kubernetes):
```groovy
stage('Deploy to EKS') {
    steps {
        sh "aws eks update-kubeconfig --region ${AWS_REGION} --name heart-disease-cluster"
        sh "kubectl apply -f heart-disease-mlops/k8s/deployment.yaml"
        sh "kubectl apply -f heart-disease-mlops/k8s/service.yaml"
    }
}
```

### For AWS EC2 (Docker):
```groovy
stage('Deploy to EC2') {
    steps {
        // Use SSH to pull and restart the container on your EC2 instance
        sshagent(['ec2-ssh-key']) {
            sh "ssh -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest && docker stop heart-disease-api || true && docker rm heart-disease-api || true && docker run -d --name heart-disease-api -p 8000:8000 ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest'"
        }
    }
}
```

---

## ✅ Step 4: Verify the Automation

1. **Commit a Change**: Make a small change (e.g., update a comment in `src/train_model.py`).
2. **Push to GitHub**: `git push origin main`.
3. **Check Jenkins**: You should see a new build start automatically.
4. **Check AWS**:
   - Verify the new image in the **ECR console**.
   - Verify the running application on your **EC2/EKS endpoint**.

---

## 📝 Summary of Requirements

1. **Public Jenkins URL**: GitHub needs to be able to reach your Jenkins server via the internet.
2. **Jenkins Plugins**: Ensure the "GitHub Integration" plugin is installed.
3. **IAM Permissions**: The Jenkins user must have permissions to push to ECR and manage the deployment target.
