const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Ensure the dist directory exists
fs.ensureDirSync('dist');

// Copy public folder to dist
fs.copySync('public', 'dist/public', { overwrite: true });

// Run TypeScript compiler
exec('tsc', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during TypeScript compilation: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`TypeScript compiler warnings: ${stderr}`);
  }
  if (stdout) {
    console.log(stdout);
  }
  console.log('Build completed successfully!');
}); 