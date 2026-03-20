import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

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
    <div style={{ padding: "20px" }}>
      <h1>🚀 DevOps Dashboard</h1>

      {data.length === 0 ? (
        <p>No data yet...</p>
      ) : (
        data.map((run) => (
          <div
            key={run.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p><strong>Branch:</strong> {run.head_branch}</p>
            <p><strong>Status:</strong> {run.status}</p>
            <p><strong>Conclusion:</strong> {run.conclusion}</p>
            <p><strong>Commit:</strong> {run.head_commit?.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
