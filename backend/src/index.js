const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const githubRoutes = require("./routes/github");
const { getGithubRuns } = require("./services/githubService");
const { getPods } = require("./services/k8sService"); // ✅ NEW
const { getArgoApps } = require("./services/argoService");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

// 🔹 create HTTP server
const server = http.createServer(app);

// 🔹 socket config (fixed)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔹 connection
io.on("connection", (socket) => {
  console.log("Client connected 🔌");

  socket.on("disconnect", () => {
    console.log("Client disconnected ❌");
  });
});

// 🔹 polling loop
setInterval(async () => {
  try {
    // ✅ GitHub data
    const githubData = await getGithubRuns();
    io.emit("githubData", githubData);

    // ✅ Kubernetes data
    try {
      const pods = await getPods();
      io.emit("k8sData", pods);
    } catch (err) {
      console.log("K8s not ready yet ⚠️");
    }
    
    // ✅ ArgoCD data (NEW)
    try {
      const apps = await getArgoApps();
      io.emit("argoData", apps);
    } catch (err) {
      console.log("Argo not ready ⚠️");
    }

    console.log("Sent real-time update ⚡");
  } catch (err) {
    console.error("Socket error:", err.message);
  }
}, 15000);

// health route
app.get("/health", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
