const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const githubRoutes = require("./routes/github");
const { getGithubRuns } = require("./services/githubService");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

// 🔹 create HTTP server
const server = http.createServer(app);

// 🔹 attach socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔹 when client connects
io.on("connection", (socket) => {
  console.log("Client connected 🔌");

  socket.on("disconnect", () => {
    console.log("Client disconnected ❌");
  });
});

// 🔹 polling loop (every 15 sec)
setInterval(async () => {
  try {
    const data = await getGithubRuns();
    io.emit("githubData", data); // send to all clients
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
