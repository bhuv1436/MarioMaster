import { PlatformData } from "./Level";
import { sprites } from "./assets";

// Interface for item released from a block
export interface ReleasedItem {
  type: 'coin' | 'mushroom' | 'star' | 'fireflower';
  x: number;
  y: number;
  velocityY: number;
  active: boolean;
}

class Platform {
  platforms: PlatformData[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  images: Record<string, HTMLImageElement>;
  releasedItems: ReleasedItem[]; // Items that come out of blocks when hit
  questionBlockAnimation: number; // Animation timer for question blocks
  
  constructor(canvas: HTMLCanvasElement, initialPlatforms: PlatformData[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.platforms = initialPlatforms.map(platform => ({
      ...platform,
      hit: false,
      hitAnimation: 0,
      broken: false
    }));
    this.images = {};
    this.releasedItems = [];
    this.questionBlockAnimation = 0;
    
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
  
  // Handle player hitting a block from below
  hitBlock(blockId: string): { itemReleased: boolean; itemType?: string } {
    const result = { 
      itemReleased: false, 
      itemType: undefined as undefined | string 
    };
    
    const blockIndex = this.platforms.findIndex(p => p.id === blockId);
    if (blockIndex === -1) return result;
    
    const block = this.platforms[blockIndex];
    
    // Already hit blocks don't respond again (question blocks) or are already broken (brick blocks)
    if (block.hit || block.broken) return result;
    
    // Handle different block types
    switch (block.type) {
      case 'question':
        // Question block gets hit and may release an item
        this.platforms[blockIndex] = {
          ...block,
          hit: true,
          hitAnimation: 0.2 // Start animation timer (in seconds)
        };
        
        // Add a contained item if specified
        if (block.containsItem) {
          this.releasedItems.push({
            type: block.containsItem,
            x: block.x + block.width / 2 - 15, // Center item on block
            y: block.y - 40, // Position above block
            velocityY: -200, // Initial upward velocity for the item
            active: true
          });
          
          result.itemReleased = true;
          result.itemType = block.containsItem;
        } else {
          // Default to releasing a coin if no specific item
          this.releasedItems.push({
            type: 'coin',
            x: block.x + block.width / 2 - 15,
            y: block.y - 40,
            velocityY: -200,
            active: true
          });
          
          result.itemReleased = true;
          result.itemType = 'coin';
        }
        break;
        
      case 'brick':
        // If Mario is big, bricks can be broken
        if (true) { // We'll replace this condition with a check for Mario's size
          // Mark brick as broken
          this.platforms[blockIndex] = {
            ...block,
            broken: true,
            hitAnimation: 0.2
          };
          
          // Could add brick particles/debris animation here
        } else {
          // Small Mario just bumps the brick
          this.platforms[blockIndex] = {
            ...block,
            hitAnimation: 0.2
          };
        }
        break;
    }
    
    return result;
  }
  
  // Update platforms and animations
  update(deltaTime: number) {
    // Update block hit animations
    this.platforms = this.platforms.map(platform => {
      if (platform.hitAnimation && platform.hitAnimation > 0) {
        // Update animation timer
        const newAnimationTime = platform.hitAnimation - deltaTime;
        
        return {
          ...platform,
          // If animation complete, reset to 0
          hitAnimation: newAnimationTime > 0 ? newAnimationTime : 0
        };
      }
      
      // Remove broken bricks that have finished their animation
      if (platform.broken && platform.hitAnimation === 0) {
        return {
          ...platform,
          // Make broken bricks invisible but keep their collision data
          width: 0,
          height: 0
        };
      }
      
      return platform;
    });
    
    // Update question block animations
    this.questionBlockAnimation += deltaTime;
    if (this.questionBlockAnimation > 1) {
      this.questionBlockAnimation = 0;
    }
    
    // Update released items
    this.releasedItems.forEach(item => {
      if (!item.active) return;
      
      // Apply gravity to items except coins (which just move up and vanish)
      if (item.type !== 'coin') {
        item.velocityY += 600 * deltaTime; // Apply gravity
        item.y += item.velocityY * deltaTime;
        
        // Make items land on platforms
        // In a more complete implementation, we would check collision with platforms
      } else {
        // Coins just float up and disappear
        item.y += item.velocityY * deltaTime;
        
        // Remove coin after it's floated up enough
        if (item.y < item.y - 60) {
          item.active = false;
        }
      }
    });
    
    // Remove inactive items
    this.releasedItems = this.releasedItems.filter(item => item.active);
  }
  
  render(cameraOffsetX: number) {
    // First render the platforms
    this.platforms.forEach(platform => {
      // Skip rendering broken blocks that have finished animating
      if (platform.broken && platform.hitAnimation === 0) return;
      
      const { x, y, width, height, type, hit, hitAnimation } = platform;
      
      // Convert world coordinates to screen coordinates
      const screenX = x - cameraOffsetX;
      
      // Skip rendering if the platform is outside the visible area
      if (screenX + width < 0 || screenX > this.canvas.width) {
        return;
      }
      
      // Calculate vertical offset for hit animation
      const hitOffset = hitAnimation ? Math.sin(hitAnimation * Math.PI * 5) * 10 * hitAnimation : 0;
      const renderY = y - hitOffset;
      
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
              screenX + tx * 32, renderY + ty * 32, tileWidth, tileHeight // Destination rectangle with animation offset
            );
          }
        }
        
        // Draw outline for visual clarity
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, renderY, width, height);
      } else {
        // Fallback colors if textures not loaded
        switch (type) {
          case 'ground':
            this.ctx.fillStyle = '#8B4513'; // Brown
            break;
          case 'brick':
            this.ctx.fillStyle = hit ? '#A0522D' : '#B22222'; // Darker when hit
            break;
          case 'question':
            this.ctx.fillStyle = hit ? '#CD853F' : '#FFD700'; // Brown when hit, gold otherwise
            break;
          case 'pipe':
            this.ctx.fillStyle = '#008000'; // Green
            break;
          default:
            this.ctx.fillStyle = '#333333'; // Dark gray
        }
        
        this.ctx.fillRect(screenX, renderY, width, height);
      }
      
      // Add special visualization for question blocks
      if (type === 'question') {
        if (!hit) {
          // Animate the question mark (pulse effect) for unhit blocks
          const pulse = 1 + Math.sin(this.questionBlockAnimation * Math.PI * 2) * 0.1;
          
          this.ctx.fillStyle = '#FFFF00';
          this.ctx.font = `${20 * pulse}px Arial`;
          this.ctx.fillText('?', screenX + width/2 - 6, renderY + height/2 + 6);
        } else {
          // Empty block visual
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(screenX + 8, renderY + 8, width - 16, height - 16);
        }
      }
      
      // Add special visualization for pipes
      if (type === 'pipe') {
        // Draw pipe opening
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(screenX + 5, renderY + 5, width - 10, 10);
      }
    });
    
    // Then render any released items
    this.releasedItems.forEach(item => {
      if (!item.active) return;
      
      const screenX = item.x - cameraOffsetX;
      
      // Skip if off-screen
      if (screenX < -30 || screenX > this.canvas.width) return;
      
      // Draw different items
      switch (item.type) {
        case 'coin':
          // Draw coin
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.arc(screenX + 15, item.y + 15, 15, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Coin sparkle
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.beginPath();
          this.ctx.arc(screenX + 10, item.y + 10, 3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'mushroom':
          // Draw mushroom
          this.ctx.fillStyle = '#FF0000';
          this.ctx.fillRect(screenX, item.y, 30, 30);
          
          // Mushroom spots
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.beginPath();
          this.ctx.arc(screenX + 10, item.y + 10, 5, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.beginPath();
          this.ctx.arc(screenX + 20, item.y + 10, 5, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'star':
          // Star
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          
          // Star shape
          const cx = screenX + 15;
          const cy = item.y + 15;
          const spikes = 5;
          const outerRadius = 15;
          const innerRadius = 7;
          
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = Math.PI * i / spikes - Math.PI / 2;
            
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            
            if (i === 0) {
              this.ctx.moveTo(x, y);
            } else {
              this.ctx.lineTo(x, y);
            }
          }
          
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case 'fireflower':
          // Flower base
          this.ctx.fillStyle = '#008000';
          this.ctx.fillRect(screenX + 10, item.y + 20, 10, 10);
          
          // Flower petals
          this.ctx.fillStyle = '#FF0000';
          this.ctx.beginPath();
          this.ctx.arc(screenX + 15, item.y + 15, 12, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Flower center
          this.ctx.fillStyle = '#FFFF00';
          this.ctx.beginPath();
          this.ctx.arc(screenX + 15, item.y + 15, 5, 0, Math.PI * 2);
          this.ctx.fill();
          break;
      }
    });
  }
  
  reset(initialPlatforms: PlatformData[]) {
    this.platforms = [...initialPlatforms];
  }
}

export default Platform;
