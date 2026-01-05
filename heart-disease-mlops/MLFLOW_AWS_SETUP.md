# MLflow Server Setup on AWS (Student Guide)

Setting up an MLflow server on AWS allows your "Robot Assistant" (Jenkins) to save training results to a central "Lab Notebook" that you can access from anywhere.

---

### 🕒 Total Time: 15-20 minutes
### 💰 Cost: Free Tier eligible (t2.micro/t3.micro)

---

### 📍 Step 1: Launch an EC2 Instance (The Server)

1.  **Log in to AWS Console** and search for **EC2**.
2.  Click **Launch Instance**.
3.  **Name**: `mlflow-server`
4.  **OS**: **Ubuntu** (Latest LTS version).
5.  **Instance Type**: `t2.micro` or `t3.micro` (Free Tier).
6.  **Key Pair**: Create a new one or use an existing one (you'll need this to log in).
7.  **Network Settings**: 
    *   Allow **SSH** (Port 22).
    *   Allow **HTTP** (Port 80) - optional.
    *   **CRITICAL**: Click "Edit" and add a **Custom TCP Rule** for **Port 5000**. Set "Source" to `0.0.0.0/0` (so you can see the dashboard).
8.  Click **Launch Instance**.

---

### 💻 Step 2: Install MLflow on the Server

Once your instance is "Running," click **Connect** to open the terminal, then copy-paste these commands:

```bash
# 1. Update the system
sudo apt update && sudo apt upgrade -y

# 2. Install Python and Pip
sudo apt install python3-pip -y

# 3. Install MLflow
pip3 install mlflow
```

---

### 🚀 Step 3: Start the MLflow Server

Run this command to start the server in a way that stays running:

```bash
# Start MLflow listening on all addresses
nohup mlflow server --host 0.0.0.0 --port 5000 &
```

*Note: `nohup` and `&` keep the server running even after you close the terminal.*

---

### 🔗 Step 4: Access your Dashboard

1.  Go back to your **AWS EC2 Dashboard**.
2.  Find your `mlflow-server` and copy the **Public IPv4 Address** (e.g., `12.34.56.78`).
3.  Open your browser and type: `http://12.34.56.78:5000`
4.  **You should now see the MLflow UI!**

---

### 🤖 Step 5: Tell Jenkins where to find it

In your `Jenkinsfile` (or local environment), set your `MLFLOW_TRACKING_URI`:

```bash
export MLFLOW_TRACKING_URI="http://12.34.56.78:5000"
```

---

### 💡 Summary of "Why"

*   **Port 5000**: This is the default "door" MLflow uses to talk to the world.
*   **0.0.0.0**: This tells the server to listen to requests from *any* IP address (like Jenkins or your browser).
*   **nohup**: This is like "don't hang up"—it prevents the server from stopping when you log out.

---

**Next Step**: Once this is running, your `Jenkinsfile` will automatically start sending "Lab Notes" here!
