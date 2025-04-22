// Simple deployment script for GitHub Pages
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the app with the GitHub Pages config
console.log('Building app for GitHub Pages...');
execSync('npx vite build --config vite.github.config.js', { stdio: 'inherit' });

// Create a .nojekyll file to prevent Jekyll processing
const nojekyllPath = path.join(__dirname, 'dist', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('Created .nojekyll file');

// If you're using the gh-pages package
console.log('Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist', { stdio: 'inherit' });
console.log('Deployment complete!');