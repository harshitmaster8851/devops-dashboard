const { exec } = require("child_process");

const getPods = () => {
  return new Promise((resolve, reject) => {
    exec("kubectl get pods -o json", (err, stdout) => {
      if (err) return reject(err);

      const pods = JSON.parse(stdout);

      const formatted = pods.items.map((pod) => ({
        name: pod.metadata.name,
        status: pod.status.phase,
      }));

      resolve(formatted);
    });
  });
};

module.exports = { getPods };
