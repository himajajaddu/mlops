# 🎓 Student's Master Guide: Local MLOps Pipeline (MacBook)

This guide is for students running everything on their local MacBook. We have removed the web UI and focused entirely on the **ML Pipeline**, **Jenkins**, and **AWS ECS**.

---

### 💻 Phase 1: Local Environment Setup
You need your MacBook ready to act as a Server and a Robot.

1.  **Install Docker Desktop**: 
    *   Download from [docker.com](https://www.docker.com/products/docker-desktop).
    *   **Verify**: Open Terminal and type `docker --version`.
2.  **Install Jenkins**:
    *   **Option A (Homebrew)**: `brew install jenkins-lts` then `brew services start jenkins-lts`.
    *   **Option B (Docker)**: `docker run -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts`.
    *   **Access**: Open `http://localhost:8080` in your browser.
3.  **Install AWS CLI (Important)**:
    *   **Step 1**: Go to the [AWS CLI Install Page](https://aws.amazon.com/cli/).
    *   **Step 2**: Download and run the **macOS PKG installer**.
    *   **Step 3**: **Restart your Terminal** (close the window and open a new one).
    *   **Verify**: Type `aws --version`. It should now show a version number instead of "command not found".
    *   **Setup**: Run `aws configure` and enter your Keys (IAM User with ECR/ECS permissions).

---

### 🧪 Phase 2.5: Automated Testing
**Goal:** Make sure your code doesn't break.
1.  **Test Folder**: Look at the `tests/` folder at the root.
2.  **Running Tests**: You can run `python -m unittest discover tests` to check your code.
3.  **Local Jenkins Integration**: Your `Jenkinsfile` is configured to run these tests automatically every time a build is triggered. If the tests fail, the build stops. This is called a **"Failing Fast"** strategy.

---

### 🤖 Phase 2: ML Pipeline & MLflow (The Core)
We use Python to train models and MLflow to pick the best one.

1.  **Training**: Run `python heart-disease-mlops/src/train_model.py`.
2.  **Choosing the Model**: The script uses MLflow to log metrics (Accuracy, F1-Score). It is programmed to only "Register" the model if it beats the previous best.
3.  **MLflow UI**: Run `mlflow ui` and visit `http://localhost:5000` to see your experiments.

---

### ☁️ Phase 4: AWS Setup (The Beginner's Guide)
**Goal:** Set up your cloud "Warehouse" (ECR) and "Server" (ECS) from scratch.

#### 1. Create your AWS Account & User
*   **Sign Up**: Go to [aws.amazon.com](https://aws.amazon.com) and create a "Root" account.
*   **Create a User (IAM)**: 
    1. Search for **IAM** in the top search bar.
    2. Click **Users** on the left, then **Create user**.
    3. Name it `jenkins-user`.
    4. Click **Next**, then select **Attach policies directly**.
    5. Search and check these boxes: `AmazonEC2ContainerRegistryFullAccess`, `AmazonECS_FullAccess`.
    6. Click **Next**, then **Create user**.

#### 2. Get your "Keys" (Access Credentials)
1. Click on your new `jenkins-user`.
2. Go to the **Security credentials** tab.
3. Scroll to **Access keys** and click **Create access key**.
4. Choose **Command Line Interface (CLI)**.
5. **IMPORTANT**: Copy the **Access Key ID** and **Secret Access Key**. Save them in a notepad; the Secret key disappears forever once you leave this page!

#### 3. Setup the "Storage" (AWS ECR)
*Think of this as a private folder where your Docker images live.*
1. Search for **ECR** (Elastic Container Registry).
2. Click **Create repository**.
3. Name it `heart-disease-api`.
4. Keep everything else default and click **Create**.
5. Copy the **URI** (looks like `123456789.dkr.ecr...`). You'll need this later.

#### 4. Setup the "Runner" (AWS ECS)
*Think of this as the actual computer that runs your app.*

**⚠️ Note on "Service Linked Role" Error:**
If you see an error saying `Service role name AWSServiceRoleForECS has been taken`, it means **the permissions are already set up correctly!** You don't need to do anything else for this step.

**To continue:**
Just go back to the AWS console and proceed with creating your cluster. It will now have the permissions it needs.

1. Search for **ECS** (Elastic Container Service).
2. **Create Cluster**:
   - Click **Clusters** -> **Create Cluster**.
   - Name it `heart-disease-cluster`.
   - Select **AWS Fargate (serverless)** (it's the easiest).
   - Click **Create**.
3. **Create Task Definition**:
   - Click **Task Definitions** -> **Create new Task Definition with JSON**.
   - Paste the following (replace `<IMAGE_URI>` with your ECR URI from Step 3):
     ```json
     {
       "family": "heart-disease-task",
       "containerDefinitions": [{
         "name": "api-container",
         "image": "<IMAGE_URI>",
         "portMappings": [{ "containerPort": 8000 }]
       }],
       "cpu": "256", "memory": "512",
       "networkMode": "awsvpc",
       "requiresCompatibilities": ["FARGATE"]
     }
     ```
4. **Create Service**:
   - Inside your `heart-disease-cluster`, go to the **Services** tab and click **Create**.
   - Select **Deployment configuration** -> **Family**: `heart-disease-task`.
   - Service name: `heart-disease-service`.
   - Under **Networking**, ensure "Public IP" is **Turned ON**.

---

### 🔄 Phase 5: Local Jenkins Pipeline (Task 5)
**Goal:** Make your MacBook automatically build and push whenever you save code.

1.  **Connect GitHub to Local Jenkins**:
    *   Since your MacBook is behind a router, you need **ngrok** to let GitHub "talk" to your local Jenkins.
    *   Run `ngrok http 8080`. Copy the `https` URL it gives you.
    *   In GitHub: Go to **Settings** -> **Webhooks** -> **Add Webhook**.
    *   **Payload URL**: `<your-ngrok-url>/github-webhook/`.
2.  **Jenkins Job Setup**:
    *   New Item -> **Pipeline** -> Name it "Heart-Disease-Pipeline".
    *   **Build Trigger**: Select "GitHub hook trigger for GITScm polling".
    *   **Pipeline Definition**: Select "Pipeline script from SCM" -> Git -> Enter your Repo URL.
    *   **Lightweight Checkout**: Checked.

---

### 🐳 Phase 4: Containerization & AWS ECS (Tasks 6 & 7)
**Goal:** Turn your best model into a container and put it on AWS ECS.

1.  **The Jenkinsfile**: Your project includes a `Jenkinsfile`. It does these steps automatically:
    *   **Stage: Test**: Runs `python -m unittest discover tests`.
    *   **Stage: Train**: Runs the ML training and registers the best model.
    *   **Stage: Build**: Runs `docker build -t heart-disease-api .`.
    *   **Stage: Push**: Tags and pushes the image to **AWS ECR**.
    *   **Stage: Deploy**: Updates your **AWS ECS Service** to use the new image.

2.  **AWS Setup**:
    *   **ECR Repository**: Create a repo named `heart-disease-api`.
    *   **ECS Cluster**: Create a cluster (Fargate is easiest for students).
    *   **ECS Task Definition**: Create a definition for your API.

---

### 🏁 How to Verify
1.  **Commit Code**: Change something in `train_model.py` and run `git commit` / `git push`.
2.  **Watch Jenkins**: Go to `http://localhost:8080`. You will see the build start automatically.
3.  **Check AWS**: Once Jenkins finishes, visit your ECS Service in the AWS Console. You should see a "New Deployment" running your latest code.

---

### 📂 File Structure (Cleaned)
*   **`heart-disease-mlops/`**: All ML code (api, src, data, notebooks).
*   **`tests/`**: Unit tests for the pipeline.
*   **`Dockerfile`**: Instructions for making the API container.
*   **`Jenkinsfile`**: The automation script.
