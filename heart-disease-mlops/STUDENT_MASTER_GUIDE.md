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
3.  **Install AWS CLI**:
    *   Follow [AWS CLI Install Guide](https://aws.amazon.com/cli/).
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

### 🔄 Phase 3: Local Jenkins Pipeline (Task 5)
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
