import { EnemyData } from "./Level";

export interface EnemyState extends EnemyData {
  isDead: boolean;
  deathTimer: number;
}

class Enemy {
  enemies: EnemyState[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  spriteImg: HTMLImageElement;
  frameWidth: number = 32;
  frameHeight: number = 32;
  
  constructor(canvas: HTMLCanvasElement, initialEnemies: EnemyData[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Create enemy states from initial data
    this.enemies = initialEnemies.map(enemy => ({
      ...enemy,
      isDead: false,
      deathTimer: 0
    }));
    
    // Setup sprite
    this.spriteImg = new Image();
    // Using SVG for enemy sprites
    this.spriteImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32"><rect x="0" y="0" width="32" height="32" fill="brown"/><rect x="32" y="0" width="32" height="32" fill="green"/></svg>`;
  }
  
  update(deltaTime: number) {
    this.enemies.forEach(enemy => {
      if (enemy.isDead) {
        // If enemy is dead, update death timer
        enemy.deathTimer += deltaTime;
        
        // Remove enemy after 1 second of death animation
        if (enemy.deathTimer > 1) {
          enemy.y = 2000; // Move far out of view
        }
        return;
      }
      
      // Move the enemy based on its speed and direction
      enemy.x += enemy.speed * enemy.direction * deltaTime;
      
      // Handle movement range if specified
      if (enemy.range) {
        if (enemy.x <= enemy.range.min) {
          enemy.direction = 1; // Start moving right
        } else if (enemy.x + enemy.width >= enemy.range.max) {
          enemy.direction = -1; // Start moving left
        }
      }
    });
  }
  
  render(cameraOffsetX: number) {
    this.enemies.forEach(enemy => {
      // Skip rendering dead enemies after their death animation
      if (enemy.isDead && enemy.deathTimer > 1) return;
      
      // Convert world coordinates to screen coordinates
      const screenX = enemy.x - cameraOffsetX;
      
      // Skip rendering if the enemy is outside the visible area
      if (screenX + enemy.width < 0 || screenX > this.canvas.width) {
        return;
      }
      
      // Draw enemy differently based on type
      if (enemy.type === 'goomba') {
        this.ctx.fillStyle = '#8B4513'; // Brown
      } else if (enemy.type === 'koopa') {
        this.ctx.fillStyle = '#008000'; // Green
      }
      
      // Draw the enemy with opacity if dead
      if (enemy.isDead) {
        this.ctx.globalAlpha = 1 - enemy.deathTimer;
      }
      
      this.ctx.fillRect(screenX, enemy.y, enemy.width, enemy.height);
      
      // Draw eyes
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(screenX + 8, enemy.y + 8, 6, 6);
      this.ctx.fillRect(screenX + enemy.width - 14, enemy.y + 8, 6, 6);
      
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(screenX + 10, enemy.y + 10, 2, 2);
      this.ctx.fillRect(screenX + enemy.width - 12, enemy.y + 10, 2, 2);
      
      // If enemy is dead, draw X eyes
      if (enemy.isDead) {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        
        // Left eye X
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + 6, enemy.y + 6);
        this.ctx.lineTo(screenX + 16, enemy.y + 16);
        this.ctx.moveTo(screenX + 16, enemy.y + 6);
        this.ctx.lineTo(screenX + 6, enemy.y + 16);
        this.ctx.stroke();
        
        // Right eye X
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + enemy.width - 16, enemy.y + 6);
        this.ctx.lineTo(screenX + enemy.width - 6, enemy.y + 16);
        this.ctx.moveTo(screenX + enemy.width - 6, enemy.y + 6);
        this.ctx.lineTo(screenX + enemy.width - 16, enemy.y + 16);
        this.ctx.stroke();
      }
      
      // Reset opacity
      this.ctx.globalAlpha = 1;
    });
  }
  
  killEnemy(enemyId: string) {
    const enemy = this.enemies.find(e => e.id === enemyId);
    if (enemy) {
      enemy.isDead = true;
      enemy.deathTimer = 0;
      enemy.speed = 0; // Stop movement
    }
  }
  
  reset(initialEnemies: EnemyData[]) {
    this.enemies = initialEnemies.map(enemy => ({
      ...enemy,
      isDead: false,
      deathTimer: 0
    }));
  }
  
  getAliveEnemies() {
    return this.enemies.filter(enemy => !enemy.isDead);
  }
}

export default Enemy;
