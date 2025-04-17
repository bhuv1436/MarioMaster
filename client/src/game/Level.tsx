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
    // Load background
    const bgImage = new Image();
    bgImage.src = this.currentLevel.background === 'sky' ? '/textures/sky.png' : '/textures/grass.png';
    this.images['background'] = bgImage;
    
    // Load platform images
    const groundImage = new Image();
    groundImage.src = '/textures/grass.png';
    this.images['ground'] = groundImage;
    
    const brickImage = new Image();
    brickImage.src = '/textures/wood.jpg';
    this.images['brick'] = brickImage;
    
    // Could add more texture images for other platform types
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
    
    this.cameraOffset.x = targetX;
  }
  
  render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    if (this.images['background']) {
      // Tile the background image
      const bgImage = this.images['background'];
      const pattern = ctx.createPattern(bgImage, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
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
