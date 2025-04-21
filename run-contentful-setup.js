// This script runs the Contentful setup with environment variables
import { exec } from 'child_process';
import { config } from 'dotenv';

// Load environment variables from .env file if it exists
config();

// Export environment variables for the child process
const env = {
  ...process.env,
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN
};

console.log('Starting Contentful setup process...');
console.log(`Using Space ID: ${env.CONTENTFUL_SPACE_ID}`);
console.log('Management token available:', !!env.CONTENTFUL_MANAGEMENT_TOKEN);

// Execute the setup script
const child = exec('node contentful-setup-sdk.js', {
  env
});

// Forward stdout and stderr
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('exit', (code) => {
  console.log(`Contentful setup process exited with code ${code}`);
});