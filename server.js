const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

app.post('/start-program', (req, res) => {
  const { username, password, environment, sshDetails } = req.body;
  const scriptPath = './miner.sh';
  const args = [username, password, environment, sshDetails];
  const script = spawn('bash', [scriptPath, ...args]);

  script.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  script.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  script.on('close', (code) => {
    res.json({ message: `Process exited with code ${code}` });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
