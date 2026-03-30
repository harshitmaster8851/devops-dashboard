const fetch = require("node-fetch");

const PROM_URL = "http://localhost:9090";

async function getMetrics() {
  const query = "up";

  const res = await fetch(
    `${PROM_URL}/api/v1/query?query=${encodeURIComponent(query)}`
  );

  const json = await res.json();

  return json.data.result.map((item) => ({
    service: item.metric.job || "unknown",
    status: item.value[1] === "1" ? "UP" : "DOWN",
  }));
}

module.exports = { getMetrics };
