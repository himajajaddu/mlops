# AWS Cloud Deployment & Jenkins Integration Guide

This guide provides the necessary steps and configuration to integrate your MLOps pipeline with Jenkins and deploy to your personal AWS account.

---

## 🏗 AWS Infrastructure Setup

### 1. IAM User Configuration
Create an IAM user for Jenkins with the following permissions:
- `AmazonEC2ContainerRegistryFullAccess`
- `AmazonEKSClusterPolicy` (if using EKS)
- `AdministratorAccess` (for initial setup, then restrict to specific resources)

**Store these credentials safely:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`

### 2. ECR Repository
Create an Elastic Container Registry (ECR) to store your Docker images:
```bash
aws ecr create-repository --repository-name heart-disease-api --region us-east-1
```

### 3. Deployment Targets (Choose one)

#### Option A: Elastic Kubernetes Service (EKS)
1. Create an EKS cluster using `eksctl`:
   ```bash
   eksctl create cluster --name heart-disease-cluster --region us-east-1 --nodegroup-name standard-nodes --nodes 2
   ```
2. Update `Jenkinsfile` to include `kubectl` commands.

#### Option B: Elastic Compute Cloud (EC2)
1. Launch an EC2 instance (Amazon Linux 2) with Docker installed.
2. Ensure the Security Group allows inbound traffic on port 8000.

---

## 🛠 Jenkins Configuration

### 1. Install Required Plugins
- **Docker Pipeline**
- **AWS Steps**
- **Pipeline: AWS Steps**
- **Git**

### 2. Configure Credentials
In Jenkins, navigate to `Manage Jenkins` -> `Credentials` -> `System` -> `Global credentials`:
- Add **Secret Text** for `AWS_ACCOUNT_ID`.
- Add **Secret Text** for `AWS_ACCESS_KEY_ID`.
- Add **Secret Text** for `AWS_SECRET_ACCESS_KEY`.
- (Optional) Add **SSH Username with private key** if deploying to EC2 via SSH.

### 3. Create Jenkins Pipeline
1. Create a "New Item" -> "Pipeline".
2. Name it `heart-disease-mlops`.
3. Under "Pipeline", select "Pipeline script from SCM".
4. Set SCM to "Git", provide your repository URL, and set the script path to `heart-disease-mlops/Jenkinsfile`.

---

## 🚀 Deployment Steps

1. **Push Code:** Commit and push the `Jenkinsfile` and AWS configurations to your repository.
2. **Trigger Build:** In Jenkins, click "Build Now".
3. **Verify:**
   - Check the **ECR Console** to see the new Docker image.
   - Check **Jenkins Console Output** for build logs.
   - Access the API via the EKS LoadBalancer URL or EC2 Public IP on port 8000.

---

## 📝 Configuration Files Summary

| File | Purpose |
|------|---------|
| `heart-disease-mlops/Jenkinsfile` | CI/CD pipeline definition for Jenkins. |
| `heart-disease-mlops/Dockerfile` | Defines the container for the API. |
| `heart-disease-mlops/k8s/` | Kubernetes manifests for cloud deployment. |

---

## ⚠️ Security Best Practices
- **Minimize Permissions:** Use specific IAM policies instead of `AdministratorAccess`.
- **Secret Management:** Never hardcode AWS keys in your code; always use Jenkins Credentials.
- **Resource Cleanup:** Remember to terminate AWS resources (`eksctl delete cluster`, etc.) when not in use to avoid costs.
