import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

function App() {
  const [data, setData] = useState([]);
  const [pods, setPods] = useState([]);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000");

      socket.on("connect", () => {
        console.log("✅ Connected");
      });

      socket.on("githubData", (newData) => {
        setData(newData);
      });

      socket.on("k8sData", (podData) => {
        setPods(podData);
      });
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 DevOps Dashboard</h1>

      {/* GitHub Section */}
      <h2>📦 GitHub Pipelines</h2>
      {data.length === 0 ? (
        <p style={styles.empty}>No pipeline data yet...</p>
      ) : (
        <div style={styles.grid}>
          {data.map((run) => {
            const color =
              run.conclusion === "success"
                ? "#22c55e"
                : run.conclusion === "failure"
                ? "#ef4444"
                : "#f59e0b";

            return (
              <div key={run.id} style={styles.card}>
                <div style={styles.header}>
                  <span style={styles.branch}>{run.branch}</span>
                  <span style={{ ...styles.status, color }}>
                    {run.conclusion}
                  </span>
                </div>

                <div style={styles.body}>
                  <p>Status: {run.status}</p>
                  <p>Commit: {run.commit}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kubernetes Section */}
      <h2 style={{ marginTop: "30px" }}>☸️ Kubernetes Pods</h2>
      {pods.length === 0 ? (
        <p style={styles.empty}>No pod data yet...</p>
      ) : (
        <div style={styles.grid}>
          {pods.map((pod) => {
            const color =
              pod.status === "Running"
                ? "#22c55e"
                : pod.status === "Pending"
                ? "#f59e0b"
                : "#ef4444";

            return (
              <div key={pod.name} style={styles.card}>
                <div style={styles.header}>
                  <span>{pod.name}</span>
                  <span style={{ color }}>{pod.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;

// ✅ styles MUST be outside component
const styles = {
  container: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    padding: "20px",
    fontFamily: "sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  branch: {
    fontWeight: "bold",
  },

  status: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  body: {
    fontSize: "14px",
    color: "#cbd5f5",
  },
};
