const calculateDoraMetrics = (githubRuns = []) => {
  if (!githubRuns.length) {
    return {
      deploymentFrequency: 0,
      changeFailureRate: 0,
      leadTime: 0,
      mttr: 0,
    };
  }

  const totalDeployments = githubRuns.length;

  const failed = githubRuns.filter(
    (run) => run.conclusion === "failure"
  ).length;

  const successful = githubRuns.filter(
    (run) => run.conclusion === "success"
  );

  // 🔹 Deployment Frequency (per polling cycle)
  const deploymentFrequency = totalDeployments;

  // 🔹 Change Failure Rate
  const changeFailureRate =
    totalDeployments === 0
      ? 0
      : ((failed / totalDeployments) * 100).toFixed(2);

  // 🔹 Lead Time (mock: use run duration)
  const leadTime =
    successful.length > 0
      ? (
          successful.reduce((acc, r) => acc + (r.duration || 0), 0) /
          successful.length
        ).toFixed(2)
      : 0;

  // 🔹 MTTR (mock logic)
  const mttr = failed > 0 ? "High" : "Low";

  return {
    deploymentFrequency,
    changeFailureRate,
    leadTime,
    mttr,
  };
};

module.exports = { calculateDoraMetrics };
