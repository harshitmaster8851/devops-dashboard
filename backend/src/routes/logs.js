const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/:pod", (req, res) => {
  const podName = req.params.pod;

  exec(`kubectl logs ${podName}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

module.exports = router;
