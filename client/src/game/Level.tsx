import { levels } from "./levels";

// This file handles level rendering and logic
export interface LevelData {
  id: number;
  platforms: PlatformData[];
  enemies: EnemyData[];
  collectibles: CollectibleData[];
  background: string;
  width: number;
  height: number;
  startPosition: { x: number; y: number };
  finishPosition: { x: number; y: number };
}

export interface PlatformData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'brick' | 'question' | 'pipe';
  // Additional properties for interactive platforms
  hit?: boolean; // Whether the block has been hit
  hitAnimation?: number; // Animation timer for block hit
  containsItem?: 'coin' | 'mushroom' | 'star' | 'fireflower'; // What's inside the block
  broken?: boolean; // For breakable bricks
}

export interface EnemyData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'goomba' | 'koopa';
  speed: number;
  direction: number;
  range?: { min: number; max: number };
}

export interface CollectibleData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'coin' | 'mushroom' | 'star';
  collected: boolean;
}

class Level {
  currentLevel: LevelData;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cameraOffset: { x: number; y: number };
  images: Record<string, HTMLImageElement>;
  
  constructor(canvas: HTMLCanvasElement, levelId: number = 1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.currentLevel = this.getLevelData(levelId);
    this.cameraOffset = { x: 0, y: 0 };
    this.images = {};
    
    // Load images
    this.preloadImages();
  }
  
  getLevelData(levelId: number): LevelData {
    const level = levels.find(l => l.id === levelId);
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }
    return level;
  }
  
  preloadImages() {
    // Create cloud image with SVG for better visual quality
    const bgImage = new Image();
    
    // Use SVG for cloud to get better quality and avoid the separation line
    const cloudSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E6E6E6" />
          </linearGradient>
        </defs>
        <g>
          <ellipse cx="50" cy="60" rx="40" ry="30" fill="url(#cloudGradient)" />
          <ellipse cx="90" cy="50" rx="50" ry="35" fill="url(#cloudGradient)" />
          <ellipse cx="150" cy="60" rx="45" ry="30" fill="url(#cloudGradient)" />
          <ellipse cx="200" cy="50" rx="50" ry="35" fill="url(#cloudGradient)" />
          <ellipse cx="250" cy="60" rx="40" ry="30" fill="url(#cloudGradient)" />
        </g>
      </svg>
    `;
    
    // Convert SVG to data URL
    const svgBlob = new Blob([cloudSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    bgImage.src = url;
    this.images['background'] = bgImage;
    
    // Load platform images
    const groundImage = new Image();
    groundImage.src = '/textures/grass.png';
    this.images['ground'] = groundImage;
    
    const brickImage = new Image();
    brickImage.src = '/textures/wood.jpg';
    this.images['brick'] = brickImage;
    
    // Add pipe texture
    const pipeImage = new Image();
    // Green pipe using SVG
    const pipeSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="70" viewBox="0 0 60 70">
        <rect x="0" y="0" width="60" height="70" fill="#008800" />
        <rect x="5" y="5" width="50" height="10" fill="#005500" />
        <rect x="5" y="55" width="50" height="10" fill="#005500" />
      </svg>
    `;
    const pipeSvgBlob = new Blob([pipeSvg], { type: 'image/svg+xml' });
    const pipeUrl = URL.createObjectURL(pipeSvgBlob);
    pipeImage.src = pipeUrl;
    this.images['pipe'] = pipeImage;
    
    // Add question block texture
    const questionImage = new Image();
    // Question block using SVG
    const questionSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" fill="#FFD700" />
        <text x="15" y="28" font-size="24" font-weight="bold" fill="#000000">?</text>
      </svg>
    `;
    const questionSvgBlob = new Blob([questionSvg], { type: 'image/svg+xml' });
    const questionUrl = URL.createObjectURL(questionSvgBlob);
    questionImage.src = questionUrl;
    this.images['question'] = questionImage;
  }
  
  updateCameraPosition(playerX: number) {
    // Move camera to follow player, but don't go beyond level boundaries
    const canvasWidth = this.canvas.width;
    
    // Center camera on player, but keep it within level bounds
    let targetX = playerX - canvasWidth / 2;
    
    // Don't let camera go past left edge of level
    targetX = Math.max(0, targetX);
    
    // Don't let camera go past right edge of level
    targetX = Math.min(this.currentLevel.width - canvasWidth, targetX);
    
    // Smooth camera movement using interpolation
    // This creates a smoother transition as the camera follows the player
    const smoothFactor = 0.1; // Adjust this value to control smoothness (0.05-0.15 is good)
    this.cameraOffset.x += (targetX - this.cameraOffset.x) * smoothFactor;
    
    // Round camera position to avoid subpixel rendering issues that can cause visual artifacts
    this.cameraOffset.x = Math.round(this.cameraOffset.x);
  }
  
  render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    if (this.images['background']) {
      // Create a proper parallax background with a sky
      // First, draw a solid sky color
      ctx.fillStyle = '#87CEEB'; // Sky blue
      ctx.fillRect(0, 0, width, height);
      
      // Draw clouds with parallax scrolling effect
      const bgImage = this.images['background'];
      
      // Apply a slower scrolling to the background for parallax effect
      const parallaxFactor = 0.4; // Clouds move slower than foreground
      const bgOffset = this.cameraOffset.x * parallaxFactor;
      
      // Calculate how many times to repeat the image to fill the canvas width
      const bgWidth = bgImage.width;
      const repetitions = Math.ceil(width / bgWidth) + 1;
      
      // Draw the cloud image repeatedly with offset
      for (let i = 0; i < repetitions; i++) {
        const xPos = i * bgWidth - (bgOffset % bgWidth);
        // Draw at 20% from the top of the canvas
        const yPos = height * 0.2;
        ctx.drawImage(bgImage, xPos, yPos, bgWidth, bgImage.height);
      }
      
      // Add some ground color gradient at the bottom
      const gradient = ctx.createLinearGradient(0, height - 100, 0, height);
      gradient.addColorStop(0, '#8B4513'); // Brown
      gradient.addColorStop(1, '#228B22'); // Forest green
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 50, width, 50);
    }
    
    // Draw platforms with texture
    this.currentLevel.platforms.forEach(platform => {
      const { x, y, width: platformWidth, height: platformHeight, type } = platform;
      
      // Convert world coordinates to screen coordinates
      const screenX = x - this.cameraOffset.x;
      
      // Skip rendering if the platform is outside the visible area
      if (screenX + platformWidth < 0 || screenX > this.canvas.width) {
        return;
      }
      
      // Draw platform with texture if available
      if (this.images[type]) {
        ctx.drawImage(
          this.images[type],
          screenX,
          y,
          platformWidth,
          platformHeight
        );
      } else {
        // Fallback colors if textures not loaded
        switch (type) {
          case 'ground':
            ctx.fillStyle = '#8B4513'; // Brown
            break;
          case 'brick':
            ctx.fillStyle = '#B22222'; // FireBrick red
            break;
          case 'question':
            ctx.fillStyle = '#FFD700'; // Gold
            break;
          case 'pipe':
            ctx.fillStyle = '#008000'; // Green
            break;
          default:
            ctx.fillStyle = '#333333'; // Dark gray
        }
        
        ctx.fillRect(screenX, y, platformWidth, platformHeight);
      }
    });
  }
  
  switchLevel(levelId: number) {
    this.currentLevel = this.getLevelData(levelId);
    this.cameraOffset = { x: 0, y: 0 };
    this.preloadImages();
  }
}

export default Level;
