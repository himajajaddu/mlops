# 🎓 Student's Guide: From Zero to Cloud Deployment
## (A Beginner's Step-by-Step Tutorial)

Welcome! This guide is written for you as a student. We will go through every single step to get your heart disease prediction project onto the internet (the "Cloud").

---

### 🧱 Part 1: The Building Blocks
Before we start, you need accounts on three main websites. These are free for students (with limits):

1.  **GitHub** ([github.com](https://github.com)): Think of this as "Google Docs for Code." It's where you save your project.
2.  **AWS (Amazon Web Services)** ([aws.amazon.com](https://aws.amazon.com)): This is where the computers live. Your code will run on Amazon's powerful servers.
3.  **Jenkins**: This is your "Robot Assistant." Whenever you save new code to GitHub, Jenkins will notice, grab the code, and move it to AWS for you.

---

### 📍 Phase 1: Putting your code on GitHub

1.  **Log in to GitHub**: Go to [github.com](https://github.com) and create an account.
2.  **Create a Repository**:
    *   Click the **+** icon in the top right -> **New repository**.
    *   Name it `heart-disease-mlops`.
    *   Set it to **Public**.
    *   Click **Create repository**.
3.  **Upload your files**:
    *   In your Replit project, you have a folder called `heart-disease-mlops`.
    *   You will need to use the terminal to "push" these files to GitHub (I can help you with the specific commands when you are ready).

---

### ☁️ Phase 2: Setting up your AWS "Home"

AWS is huge and can be confusing. We only need two specific parts:

1.  **IAM (Identify and Access Management)**:
    *   **Visit**: Search for "IAM" in the AWS search bar.
    *   **Action**: Create a "User" for your Jenkins robot. Give it "Programmatic access."
    *   **Save this**: You will get an `Access Key ID` and a `Secret Access Key`. **Copy these immediately!** They are like the username and password for your robot.
2.  **ECR (Elastic Container Registry)**:
    *   **Visit**: Search for "ECR" in the AWS search bar.
    *   **Action**: Click **Create repository**. Name it `heart-disease-api`.
    *   **Why?**: This is a storage locker for your "Docker Image" (a package that contains your app).

---

### 🤖 Phase 3: Setting up Jenkins (The Robot)

Usually, you run Jenkins on a small AWS server (EC2).

1.  **Install Jenkins**:
    *   Launch a small server on AWS (called an **EC2 Instance**).
    *   Install Java and Jenkins on it (there are simple copy-paste scripts for this).
2.  **Give Jenkins the keys**:
    *   Open Jenkins in your browser (it usually looks like `http://your-server-ip:8080`).
    *   Go to **Manage Jenkins** -> **Credentials**.
    *   Add your AWS Keys here so Jenkins can talk to Amazon.
3.  **Create the Pipeline**:
    *   Click **New Item** -> **Pipeline**.
    *   Tell Jenkins to look at your GitHub URL.
    *   Tell it to use the `Jenkinsfile` inside your project. This file is the "instruction manual" I wrote for the robot.

---

### 📈 Part 4: MLflow (The Brain Tracker)
MLflow is like a "Lab Notebook." It records exactly how you trained your model and saves the best version.

1.  **Tracking**: When Jenkins runs your code, it tells MLflow: "I'm training a model now."
2.  **Model Registry**: After training, MLflow "registers" the model. This is like putting a "Approved" stamp on the best version.
3.  **Serving**: When your app starts on AWS, it asks MLflow: "Give me the latest approved model." This way, you don't have to manually move files around!

---

### 🔗 Phase 5: Connecting GitHub to Jenkins (Automation)

This is the "magic" part where things happen automatically.

1.  **In GitHub**:
    *   Go to your project's **Settings** -> **Webhooks**.
    *   Click **Add webhook**.
    *   In "Payload URL", type your Jenkins address (e.g., `http://your-jenkins-ip:8080/github-webhook/`).
2.  **In Jenkins**:
    *   In your Pipeline settings, check the box that says **GitHub hook trigger for GITScm polling**.

---

### 🚀 Phase 6: The "Big Moment" (Deployment)

1.  **Make a change**: Open a file in your code and change a small word in a comment.
2.  **Save/Commit**: Save the change and "Push" it to GitHub.
3.  **Watch the magic**:
    *   GitHub tells Jenkins: "Hey, there is new code!"
    *   Jenkins wakes up, pulls the code, and starts running the `Jenkinsfile`.
    *   Jenkins builds a Docker container, sends it to AWS, and updates your website.
4.  **Visit your URL**: Your app is now live on the internet!

---

### 💡 Key Terms for Students

*   **Cloud**: Just someone else's computer (in this case, Amazon's).
*   **Deployment**: Moving code from your computer to the internet so others can use it.
*   **CI/CD**: **C**ontinuous **I**ntegration (checking code for errors) and **C**ontinuous **D**eployment (sending it to the web).
*   **Docker**: A "shipping container" for your code. It makes sure the code runs exactly the same on Amazon as it does on your computer.

---

### 🏁 What should you do first?

1.  **Create your GitHub account.**
2.  **Create your AWS account.**
3.  **Ask me for the terminal commands** to move your files from Replit to your new GitHub repository.

I am here to help with every single click!
