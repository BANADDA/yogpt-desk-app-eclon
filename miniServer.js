import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import pidusage from 'pidusage';
import process from 'process';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

let pythonProcess;  

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

function broadcastLog(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}

// const pidusage = require('pidusage');

function getProcessMemoryUsage(pid) {
    return pidusage(pid)
        .then(stats => {
            return {
                memory: stats.memory, // memory usage in bytes
                cpu: stats.cpu // CPU usage percentage
            };
        })
        .catch(err => {
            console.error('Error fetching process memory usage:', err);
            return null;
        });
}

// Endpoint to get system usage data specific to the running Python process
app.get('/system-usage', async (req, res) => {
    if (pythonProcess) {
        const pid = pythonProcess.pid; // Get the PID of the running process

        try {
            const memoryUsage = await getProcessMemoryUsage(pid);
            // You would also implement disk usage tracking logic here if needed.

            if (memoryUsage) {
                res.status(200).json({
                    memoryUsage: {
                        totalMemory: memoryUsage.memory,
                        usedMemory: memoryUsage.memory,
                        freeMemory: 0 // Free memory for the process is typically 0 because it uses all allocated
                    },
                    diskUsage: {
                        totalStorage: 0, // Placeholder if disk usage is not implemented
                        usedStorage: 0,  // Placeholder if disk usage is not implemented
                        freeStorage: 0   // Placeholder if disk usage is not implemented
                    }
                });
            } else {
                res.status(500).json({
                    message: "Failed to retrieve process memory usage"
                });
            }
        } catch (error) {
            console.error('Error fetching system usage data:', error);
            res.status(500).json({
                message: "Failed to retrieve system usage data"
            });
        }
    } else {
        res.status(400).json({
            message: "Program is not running"
        });
    }
});

// Endpoint to start the Python program
app.post('/start-program', (req, res) => {
    console.log('Received /start-program request');
    broadcastLog('Received /start-program request');
    
    const { username, password, environment, sshDetails, wallet_address } = req.body;

    broadcastLog(`Username: ${username}`);
    broadcastLog(`Environment: ${environment}`);
    broadcastLog(`Wallet Address: ${wallet_address}`);
    if (environment === 'RunPod') {
        broadcastLog(`SSH Details: ${sshDetails}`);
    }

    console.log('Current working directory:', process.cwd());
    broadcastLog(`Current working directory: ${process.cwd()}`);

    const scriptPath = path.join(process.cwd(), 'miner_setup.py');
    let args = [scriptPath, username, password, wallet_address, environment];
    if (environment === 'RunPod') {
        args.push(sshDetails);
    }

    broadcastLog(`Executing command: python ${args.join(' ')}`);
    console.log(`Executing command: python ${args.join(' ')}`);

    const options = {
        cwd: process.cwd(), // Set the working directory
        env: process.env // Inherit the environment variables
    };

    pythonProcess = spawn('python', args, options);  

    // Handle stdout
    pythonProcess.stdout.on('data', (data) => {
        const logMessage = data.toString();
        console.log(logMessage); // Log to server console
        broadcastLog(logMessage); // Send to WebSocket clients
    });

    // Handle stderr
    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        console.error(errorMessage); // Log to server console
        broadcastLog(errorMessage); // Send to WebSocket clients
    });

    pythonProcess.on('close', (code) => {
        const message = `Process exited with code: ${code}`;
        if (code !== 0) {
            broadcastLog(message);
            console.error(message);
            return res.status(500).send(message);
        }
        broadcastLog('Script executed successfully.');
        console.log('Script executed successfully.');
        res.status(200).send('Script executed successfully.');
    });

    pythonProcess.on('error', (err) => {
        const errorMessage = `Failed to start process: ${err.message}`;
        broadcastLog(errorMessage);
        console.error(errorMessage);
        res.status(500).send(errorMessage);
    });
});

// Endpoint to stop the Python program
app.post('/stop-program', (req, res) => {
    console.log('Received /stop-program request');
    broadcastLog('Received /stop-program request');

    if (pythonProcess) {  
        pythonProcess.kill('SIGINT'); 
        broadcastLog('Program stopped successfully.');
        res.status(200).send('Program stopped successfully');
    } else {
        broadcastLog('No program is currently running.');
        res.status(400).send('No program is currently running');
    }
});

// Define and use the port variable
const port = process.env.PORT || 3007;

server.listen(port, () => {
    console.log(`Mini server running on port ${port}`);
});
