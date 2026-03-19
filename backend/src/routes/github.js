const express = require("express");
const router = express.Router();
const { getGithubRuns } = require("../services/githubService");

router.get("/runs", async (req, res) => {
  try {
    const data = await getGithubRuns();
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

module.exports = router;
