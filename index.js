const os = require('os');
const osUtils = require('os-utils');
const { spawn } = require('child_process');
const path = require('path');

const MAX_CPU_PERCENTAGE = 70;

function checkCPU() {
    osUtils.cpuUsage(function(cpuUsage) {
        console.log(`Current CPU Usage: ${(cpuUsage * 100).toFixed(2)}%`);

        if (cpuUsage >= MAX_CPU_PERCENTAGE / 100) {
            console.log('CPU usage exceeds threshold. Restarting server...');
            restartServer();
        } else {
            setTimeout(checkCPU, 1000);
        }
    });
}

function restartServer() {
    const nodemonPath = path.resolve(__dirname, 'node_modules', '.bin', 'nodemon');
    const childProcess = spawn(nodemonPath, ['index.js']);
    childProcess.on('close', (code) => {
        if (code === 0) {
        console.log('Server restarted successfully.');
        } else {
        console.error(`Error restarting server. Exit code: ${code}`);
        }
        checkCPU(); 
    });

    childProcess.on('error', (error) => {
        console.error(`Error restarting server: ${error}`);
    });
}

checkCPU();