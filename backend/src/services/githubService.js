const axios = require("axios");
const redis = require("../config/redis");

async function getGithubRuns() {
  const cacheKey = "github_runs";

  // 🔹 check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("FINAL CLEAN DATA:", formatted);
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

  const runs = response.data.workflow_runs;

  // 🔥 STEP 1 — sort latest first
  const sorted = runs.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // 🔥 STEP 2 — group by WORKFLOW FILE PATH (BEST IDENTIFIER)
  const unique = {};

  sorted.forEach((run) => {
    // ✅ fallback if path missing (important)
    const key = run.path || run.name;

    if (!unique[key]) {
      unique[key] = run;
    }
  });

  const latestRuns = Object.values(unique);

  // 🔥 STEP 3 — format clean data
  const formatted = latestRuns.map((run) => ({
    id: run.id,
    workflow: run.name,
    file: run.path, // useful for debugging
    status: run.status,
    conclusion: run.conclusion,
    branch: run.head_branch,
    commit: run.head_commit?.message,
    created_at: run.created_at,
  }));

  // 🔥 STEP 4 — cache CLEAN data
  await redis.set(cacheKey, JSON.stringify(formatted), "EX", 15);

  return formatted;
}

module.exports = { getGithubRuns };
