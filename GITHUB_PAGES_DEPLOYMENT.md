# Deploying Super Mario Platformer to GitHub Pages

This guide will help you deploy your Super Mario platformer game to GitHub Pages, making it accessible to anyone on the web.

## Step 1: Prepare Your Repository

1. Create a new GitHub repository (or use an existing one)
2. Push your code to the main branch

## Step 2: Modify Configuration for GitHub Pages

Since this is a client-side game, we only need to deploy the frontend. Create a new configuration file for GitHub Pages deployment:

1. Create a new file in your repository root named `vite.github.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import glsl from "vite-plugin-glsl";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: './', // This is critical for GitHub Pages
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});
```

## Step 3: Add a Deployment Script

Create a new file in your repository root named `deploy.js`:

```js
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
```

## Step 4: Create an index.html That Works Without a Server

The main issue with deploying browser games on GitHub Pages is that there's no backend server. Create a modified index.html in your repository root that loads the game without requiring a server:

1. Create a new file `client/gh-pages-index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Super Mario Platformer</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      // This script helps handle routing without a server
      (function() {
        // No server-side rendering for GitHub Pages
        window.SERVER_DATA = {}; 
        
        // Disable any server-dependent features
        window.IS_STATIC_DEPLOYMENT = true;
      })();
    </script>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```

2. Create a small modification to your `client/src/main.tsx` file to check for static deployment:

```tsx
// Add this near the top of your file, before your app renders
if (window.IS_STATIC_DEPLOYMENT) {
  console.log('Running in static deployment mode (GitHub Pages)');
  // You can add special handling for GitHub Pages here
}
```

## Step 5: Configure Package.json Scripts (manually)

Add these scripts to your package.json:

```json
"scripts": {
  "build:gh-pages": "node deploy.js",
  "deploy": "node deploy.js"
}
```

## Step 6: Deploy to GitHub Pages

1. Install the required package:
```bash
npm install gh-pages --save-dev
```

2. Run the deployment script:
```bash
npm run deploy
```

3. Your site will be deployed to: https://[your-username].github.io/[repository-name]/

## Handling Asset Paths

Make sure all your asset paths are relative, not absolute. For example:

- ✅ `./images/mario.png` (correct)
- ❌ `/images/mario.png` (incorrect)

## Client-Only Mode

Since GitHub Pages doesn't support server-side code, your game will run in client-only mode. 
This means:

1. No database access
2. No server-side APIs
3. All game state must be maintained in the browser

Your Super Mario platformer should work fine in this mode since most of the game logic runs in the browser.

## Troubleshooting

If you face any issues with your deployment:

1. Check the GitHub Pages settings in your repository
2. Make sure the build output contains all necessary files
3. Verify all paths are relative (starting with `./` not `/`)
4. Check browser console for errors