/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');

let nextProcess = null;
let isRestarting = false;

function startNextDev() {
  console.log('[AutoClipper] Starting Next.js Dev Server...');
  // Force clean the cache to prevent lingering errors
  try {
    const fs = require('fs');
    if (fs.existsSync('.next')) {
       fs.rmSync('.next', { recursive: true, force: true });
    }
  } catch {}

  nextProcess = spawn('npx', ['next', 'dev'], {
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  nextProcess.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);
    
    // Check for the specific error
    if (output.includes('Uncaught SyntaxError: Invalid or unexpected token') || output.includes('SyntaxError')) {
      handleCrash('SyntaxError detected in Next.js build!');
    }
  });

  nextProcess.stderr.on('data', (data) => {
    const output = data.toString();
    process.stderr.write(output);
    
    if (output.includes('Uncaught SyntaxError: Invalid or unexpected token') || output.includes('SyntaxError')) {
      handleCrash('SyntaxError detected in Next.js build!');
    }
  });

  nextProcess.on('close', (code) => {
    if (!isRestarting) {
      console.log(`[AutoClipper] Next.js process exited with code ${code}`);
      process.exit(code);
    }
  });
}

function handleCrash(reason) {
  if (isRestarting) return;
  isRestarting = true;
  
  console.log(`\n\n[AutoClipper] 🚨 ${reason}`);
  console.log('[AutoClipper] 🔄 Auto-restarting Next.js Server gracefully in 2 seconds...\n\n');
  
  if (nextProcess) {
    nextProcess.kill('SIGTERM');
  }

  setTimeout(() => {
    isRestarting = false;
    startNextDev();
  }, 2000);
}

// Intercept termination to cleanly exit children
process.on('SIGINT', () => {
  if (nextProcess) nextProcess.kill('SIGTERM');
  process.exit();
});

startNextDev();
