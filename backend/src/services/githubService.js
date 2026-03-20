const axios = require("axios");
const redis = require("../config/redis");

async function getGithubRuns() {
  const cacheKey = "github_runs";

  // 🔹 check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Serving from cache ⚡");
    return JSON.parse(cached);
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  const data = response.data.workflow_runs;

  // 🔹 store in Redis (15 sec)
  await redis.set(cacheKey, JSON.stringify(data), "EX", 15);

  return data;
}

module.exports = { getGithubRuns };
