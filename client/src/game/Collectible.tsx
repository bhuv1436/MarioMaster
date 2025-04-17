import { CollectibleData } from "./Level";

export interface CollectibleState extends CollectibleData {
  animationFrame: number;
  animationTimer: number;
}

class Collectible {
  collectibles: CollectibleState[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  coinImg: HTMLImageElement;
  mushroomImg: HTMLImageElement;
  starImg: HTMLImageElement;
  
  constructor(canvas: HTMLCanvasElement, initialCollectibles: CollectibleData[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Create collectible states from initial data
    this.collectibles = initialCollectibles.map(collectible => ({
      ...collectible,
      animationFrame: 0,
      animationTimer: 0
    }));
    
    // Create SVG based sprites for each collectible type
    this.coinImg = new Image();
    this.coinImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><circle cx="16" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/><circle cx="48" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/><circle cx="80" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/><circle cx="112" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/></svg>`;
    
    this.mushroomImg = new Image();
    this.mushroomImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="16" width="16" height="16" fill="red"/><circle cx="16" cy="16" r="12" fill="red" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/><circle cx="20" cy="12" r="3" fill="white"/></svg>`;
    
    this.starImg = new Image();
    this.starImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" fill="yellow" stroke="black" stroke-width="1"/></svg>`;
  }
  
  update(deltaTime: number) {
    // Animate collectibles
    this.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        collectible.animationTimer += deltaTime;
        if (collectible.animationTimer >= 0.2) { // Update animation every 0.2 seconds
          collectible.animationFrame = (collectible.animationFrame + 1) % 4;
          collectible.animationTimer = 0;
        }
      }
    });
  }
  
  render(cameraOffsetX: number) {
    this.collectibles.forEach(collectible => {
      // Skip rendering collected items
      if (collectible.collected) return;
      
      // Convert world coordinates to screen coordinates
      const screenX = collectible.x - cameraOffsetX;
      
      // Skip rendering if the collectible is outside the visible area
      if (screenX + collectible.width < 0 || screenX > this.canvas.width) {
        return;
      }
      
      // Get proper image based on collectible type
      let img;
      switch (collectible.type) {
        case 'coin':
          img = this.coinImg;
          break;
        case 'mushroom':
          img = this.mushroomImg;
          break;
        case 'star':
          img = this.starImg;
          break;
        default:
          img = this.coinImg;
      }
      
      if (img && img.complete) {
        if (collectible.type === 'coin') {
          // Draw animated coin from spritesheet
          const frameWidth = 32;
          this.ctx.drawImage(
            img,
            collectible.animationFrame * frameWidth, 0, 
            frameWidth, 32,
            screenX, collectible.y, 
            collectible.width, collectible.height
          );
        } else {
          // Draw other collectibles normally
          this.ctx.drawImage(
            img,
            screenX, collectible.y, 
            collectible.width, collectible.height
          );
        }
      } else {
        // Fallback rendering if image not loaded
        if (collectible.type === 'coin') {
          this.ctx.fillStyle = '#FFD700'; // Gold
          this.ctx.beginPath();
          this.ctx.arc(
            screenX + collectible.width / 2,
            collectible.y + collectible.height / 2,
            collectible.width / 2,
            0, Math.PI * 2
          );
          this.ctx.fill();
        } else if (collectible.type === 'mushroom') {
          this.ctx.fillStyle = '#FF0000'; // Red
          this.ctx.fillRect(screenX, collectible.y, collectible.width, collectible.height);
        } else if (collectible.type === 'star') {
          this.ctx.fillStyle = '#FFFF00'; // Yellow
          this.ctx.fillRect(screenX, collectible.y, collectible.width, collectible.height);
        }
      }
    });
  }
  
  collectItem(collectibleId: string) {
    const collectible = this.collectibles.find(c => c.id === collectibleId);
    if (collectible) {
      collectible.collected = true;
      return collectible.type;
    }
    return null;
  }
  
  getActiveCollectibles() {
    return this.collectibles.filter(c => !c.collected);
  }
  
  reset(initialCollectibles: CollectibleData[]) {
    this.collectibles = initialCollectibles.map(collectible => ({
      ...collectible,
      collected: false,
      animationFrame: 0,
      animationTimer: 0
    }));
  }
}

export default Collectible;
