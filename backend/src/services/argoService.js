const axios = require("axios");

async function getArgoApps() {
  try {
    const res = await axios.get("http://localhost:8080/api/v1/applications");

    return res.data.items.map((app) => ({
      name: app.metadata.name,
      status: app.status.sync.status,
      health: app.status.health.status,
    }));
  } catch (err) {
    console.log("Argo not ready ⚠️");
    return [];
  }
}

module.exports = { getArgoApps };
