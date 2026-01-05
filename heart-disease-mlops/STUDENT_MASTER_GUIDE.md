# 🎓 Student's Master Guide: End-to-End MLOps Assignment

This guide is designed for students with no prior knowledge of code, deployment, or URLs. Follow these steps in order to complete your Heart Disease Prediction MLOps assignment.

---

### 🧱 Phase 1: Accounts & Setup
You need a "home" for your code and a "cloud" to run it.
1.  **GitHub** ([github.com](https://github.com)): Sign up. This is where you save your project.
2.  **AWS** ([aws.amazon.com](https://aws.amazon.com)): Sign up. This is the "Cloud" (Amazon's computers).

---

### 📊 Phase 2: Data & Analysis (Task 1)
**Goal:** Get the heart data and understand it.
1.  **Download Data**: Run `python heart-disease-mlops/data/download_dataset.py`. This grabs the "Heart Disease UCI Dataset".
2.  **Clean & Preprocess**: Run `python heart-disease-mlops/src/preprocess.py`. This fixes missing info and prepares the data.
3.  **EDA (Exploratory Data Analysis)**: Run `python heart-disease-mlops/notebooks/EDA.py`.
    *   **Result**: Check the `plots/` folder. You will see histograms and heatmaps showing patient health trends.

---

### 🤖 Phase 3: Model Training & Tracking (Tasks 2, 3 & 4)
**Goal:** Train an AI to predict heart disease and track its performance.
1.  **Train Models**: Run `python heart-disease-mlops/src/train_model.py`. This trains two models: Logistic Regression and Random Forest.
2.  **MLflow Tracking**: 
    *   **What is it?**: A digital lab notebook.
    *   **Action**: While training, MLflow logs "metrics" (how accurate the model is) and "parameters".
    *   **View Results**: Run `mlflow ui` in your terminal and visit `http://localhost:5000`. You can see which model performed better.
3.  **Packaging**: The script automatically saves the best model in a reusable format.

---

### 🔄 Phase 4: Automation with Jenkins (Task 5)
**Goal:** Make everything happen automatically when you save code.
1.  **Setup Jenkins**: Launch a small AWS computer (EC2 instance) and install Jenkins.
2.  **Create Pipeline**: Connect Jenkins to your GitHub project.
3.  **The Trigger**: When you "Push" (save) code to GitHub, Jenkins will automatically start testing and training your model.

---

### 🐳 Phase 5: Containerization (Task 6)
**Goal:** Put your app in a "shipping container" so it runs anywhere.
1.  **Build Docker**: Run `docker build -t heart-disease-api:v1 .`.
2.  **Run Locally**: Run `docker run -p 8000:8000 heart-disease-api:v1`.
3.  **Test**: Visit `http://localhost:8000/docs` to see your live API. You can send patient data (JSON) and get a heart disease prediction back.

---

### ☁️ Phase 6: Cloud Deployment (Task 7)
**Goal:** Put your app on the real internet.

**How Kubernetes and Docker Work Together:**
Think of **Docker** as the "Building Material" and **Kubernetes** as the "Construction Site Manager."
*   **Docker** creates the "Shipping Container" (Image) that holds your code, libraries, and settings.
*   **Kubernetes** takes those containers and decides which computer (Server) they should run on, restarts them if they crash, and makes sure they can handle lots of visitors.

**The Workflow:**
1.  **Pack it (Docker)**: You build your app into a Docker Image.
2.  **Ship it (Registry)**: You upload that image to a storage place (like AWS ECR).
3.  **Deploy it (Kubernetes)**: You tell Kubernetes (using the files in the `k8s/` folder) to pull that image from the storage and start running it on the cloud.

**Action:**
1.  **Kubernetes Files**: Use `deployment.yaml` (the instructions for running the app) and `service.yaml` (the instructions for letting people visit the app).
2.  **Deploy**: Run `kubectl apply -f k8s/`.
3.  **Result**: Your API is now reachable via a "Load Balancer" (a public URL) that anyone can visit.

---

### 📈 Phase 7: Monitoring (Task 8)
**Goal:** Watch your app to see if it's working well.
1.  **Logging**: Check the logs of your running API to see every request made by users.
2.  **Dashboard**: Use tools like Prometheus or simple API metrics to see how many people are using your heart disease predictor.

---

### 🏁 Final Deliverable
1.  **GitHub Link**: Link to your repository.
2.  **Report**: A 10-page doc explaining your EDA, models, and deployment steps.
3.  **Video**: A short recording showing you training the model and getting a prediction from the API.

**Need help with a specific step? Just ask!**
