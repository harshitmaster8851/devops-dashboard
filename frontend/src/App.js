import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

function App() {
  const [data, setData] = useState([]);
  const [pods, setPods] = useState([]);
  const [argoApps, setArgoApps] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [services, setServices] = useState([]);
  const [dora, setDora] = useState({}); 

  // ✅ SOCKET CONNECTION
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000");

      socket.on("connect", () => {
        console.log("✅ Connected");
      });

      socket.on("githubData", (newData) => {
        setData(newData);
      });

      socket.on("argoData", (data) => {
        setArgoApps(data);
      });

      socket.on("k8sData", (podData) => {
        setPods(podData);
      });

      socket.on("doraData", (data) => {
        setDora(data);
      });

      socket.on("metricsData", (data) => {
        console.log("FRONTEND METRICS:", data);
        setMetrics(data);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // ✅ FIXED: SERVICE MERGE LOGIC (OUTSIDE)
  useEffect(() => {
    const map = {};

    data.forEach((run) => {
      const name = run.branch || "service";
      map[name] = {
        name,
        pipeline: run.conclusion,
      };
    });

    pods.forEach((pod) => {
      const name = pod.name || "service";
      if (!map[name]) map[name] = { name };
      map[name].podStatus = pod.status;
    });

    metrics.forEach((m) => {
      const name = m.service || "service";
      if (!map[name]) map[name] = { name };
      map[name].metrics = m.status;
    });

    setServices(Object.values(map));
  }, [data, pods, metrics]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 DevOps Dashboard</h1>

      {/* GitHub */}
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

            <p>
              Commit:{" "}
              <span style={styles.commit}>
                {run.commit}
              </span>
            </p>

            <p>
              Branch:
              <span style={styles.branchTag}>
                {run.branch}
              </span>
            </p>
          </div>
        </div>
      );
    })}
  </div>
)}

      {/* Kubernetes */}
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

      {/* Metrics */}
      <h2 style={{ marginTop: "30px" }}>📊 Metrics</h2>
      {metrics.length === 0 ? (
        <p style={styles.empty}>No metrics data...</p>
      ) : (
        <div style={styles.grid}>
          {metrics.map((m, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.header}>
                <span>{m.service}</span>
                <span
                  style={{
                    color: m.status === "UP" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 SERVICES OVERVIEW */}
      <h2 style={{ marginTop: "30px" }}>🧩 Services Overview</h2>
      {services.length === 0 ? (
        <p style={styles.empty}>No services yet...</p>
      ) : (
        <div style={styles.grid}>
          {services.map((svc, index) => (
            <div key={index} style={styles.card}>
              <h3>{svc.name}</h3>
              <p>Pipeline: {svc.pipeline || "N/A"}</p>
              <p>Pods: {svc.podStatus || "N/A"}</p>
              <p>Metrics: {svc.metrics || "N/A"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Argo */}
      <h2 style={{ marginTop: "30px" }}>🚀 ArgoCD Deployments</h2>
      {argoApps.length === 0 ? (
        <p style={styles.empty}>No Argo data...</p>
      ) : (
        <div style={styles.grid}>
          {argoApps.map((app) => (
            <div key={app.name} style={styles.card}>
              <div style={styles.header}>
                <span>{app.name}</span>
                <span>{app.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

	  <h2 style={{ marginTop: "30px" }}>✨DORA Metrics</h2>


<div>
  <p>Deployment Frequency: {dora.deploymentFrequency}</p>
  <p>Failure Rate: {dora.changeFailureRate}%</p>
  <p>Lead Time: {dora.leadTime}</p>
  <p>MTTR: {dora.mttr}</p>
</div>
    </div>
  );
}

export default App;

// styles
const styles = {
  container: {
    backgroundColor: "#020617",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: "24px",
    fontFamily: "Inter, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "22px",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    transition: "all 0.2s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  branch: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#93c5fd",
    backgroundColor: "#1e3a8a",
    padding: "3px 8px",
    borderRadius: "6px",
  },

  status: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  body: {
    fontSize: "13px",
    color: "#cbd5f5",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  branchTag: {
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    padding: "2px 8px",
    borderRadius: "6px",
    marginLeft: "6px",
    fontSize: "12px",
  },

  commit: {
    fontFamily: "monospace",
    color: "#f1f5f9",
  },
};
