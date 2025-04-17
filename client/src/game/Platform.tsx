import { PlatformData } from "./Level";

class Platform {
  platforms: PlatformData[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  images: Record<string, HTMLImageElement>;
  
  constructor(canvas: HTMLCanvasElement, initialPlatforms: PlatformData[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.platforms = [...initialPlatforms];
    this.images = {};
    
    // Preload platform images
    this.preloadImages();
  }
  
  preloadImages() {
    // Load platform type images
    const types = ['ground', 'brick', 'question', 'pipe'];
    
    const groundImage = new Image();
    groundImage.src = '/textures/grass.png';
    this.images['ground'] = groundImage;
    
    const brickImage = new Image();
    brickImage.src = '/textures/wood.jpg';
    this.images['brick'] = brickImage;
    
    // Can add more images for other platform types
    
    // Default texture for unspecified types
    const defaultImage = new Image();
    defaultImage.src = '/textures/asphalt.png';
    this.images['default'] = defaultImage;
  }
  
  render(cameraOffsetX: number) {
    this.platforms.forEach(platform => {
      const { x, y, width, height, type } = platform;
      
      // Convert world coordinates to screen coordinates
      const screenX = x - cameraOffsetX;
      
      // Skip rendering if the platform is outside the visible area
      if (screenX + width < 0 || screenX > this.canvas.width) {
        return;
      }
      
      // Draw platform with texture if available
      if (this.images[type]) {
        // Draw texture tiled
        const img = this.images[type];
        
        // Pattern would be ideal, but let's draw it tiled manually for better control
        let tilesX = Math.ceil(width / 32);
        let tilesY = Math.ceil(height / 32);
        
        for (let tx = 0; tx < tilesX; tx++) {
          for (let ty = 0; ty < tilesY; ty++) {
            const tileWidth = Math.min(32, width - tx * 32);
            const tileHeight = Math.min(32, height - ty * 32);
            
            this.ctx.drawImage(
              img,
              0, 0, tileWidth, tileHeight, // Source rectangle
              screenX + tx * 32, y + ty * 32, tileWidth, tileHeight // Destination rectangle
            );
          }
        }
        
        // Draw outline for visual clarity
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, y, width, height);
      } else {
        // Fallback colors if textures not loaded
        switch (type) {
          case 'ground':
            this.ctx.fillStyle = '#8B4513'; // Brown
            break;
          case 'brick':
            this.ctx.fillStyle = '#B22222'; // FireBrick red
            break;
          case 'question':
            this.ctx.fillStyle = '#FFD700'; // Gold
            break;
          case 'pipe':
            this.ctx.fillStyle = '#008000'; // Green
            break;
          default:
            this.ctx.fillStyle = '#333333'; // Dark gray
        }
        
        this.ctx.fillRect(screenX, y, width, height);
      }
      
      // Add special visualization for question blocks
      if (type === 'question') {
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('?', screenX + width/2 - 6, y + height/2 + 6);
      }
      
      // Add special visualization for pipes
      if (type === 'pipe') {
        // Draw pipe opening
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(screenX + 5, y + 5, width - 10, 10);
      }
    });
  }
  
  reset(initialPlatforms: PlatformData[]) {
    this.platforms = [...initialPlatforms];
  }
}

export default Platform;
