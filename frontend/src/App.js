import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000",{
	    transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to backend");
    });

    socket.on("githubData", (newData) => {
      console.log("🔥 Live update:", newData);
      setData(newData);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h1 style={{ textAlign: "center" }}>🚀 DevOps Dashboard</h1>

    {data.length === 0 ? (
      <p style={{ textAlign: "center" }}>No data yet...</p>
    ) : (
      data.map((run) => {
        const color =
          run.conclusion === "success"
            ? "#d4edda"
            : run.conclusion === "failure"
            ? "#f8d7da"
            : "#fff3cd";

        return (
          <div
            key={run.id}
            style={{
              background: color,
              padding: "15px",
              margin: "15px auto",
              borderRadius: "10px",
              width: "60%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>🌿 Branch:</strong> {run.head_branch}</p>
            <p><strong>⚙️ Status:</strong> {run.status}</p>
            <p><strong>✅ Result:</strong> {run.conclusion}</p>
            <p><strong>💬 Commit:</strong> {run.head_commit?.message}</p>
          </div>
        );
      })
    )}
  </div>
  );
}

export default App;
