import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket; // ✅ global socket (important)

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // prevent multiple connections
    if (!socket) {
      socket = io("http://localhost:5000");

      socket.on("connect", () => {
        console.log("✅ Connected to backend");
      });

      socket.on("githubData", (newData) => {
        console.log("🔥 FULL DATA:", newData);
        setData(newData);
      });
    }

    return () => {
      // ❌ DO NOT disconnect here (causes loop)
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🚀 DevOps Dashboard</h1>

      {data.length === 0 ? (
        <p style={{ textAlign: "center" }}>No data yet...</p>
      ) : (
        data.map((run) => (
          <div
            key={run.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px auto",
              borderRadius: "8px",
              width: "60%",
            }}
          >
            <p><strong>Branch:</strong> {run.branch}</p>
            <p><strong>Status:</strong> {run.status}</p>
            <p><strong>Result:</strong> {run.conclusion}</p>
            <p><strong>Commit:</strong> {run.commit}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
