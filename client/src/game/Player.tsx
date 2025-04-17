import { useEffect, useRef } from "react";

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: {
    x: number;
    y: number;
  };
  isJumping: boolean;
  isOnGround: boolean;
  direction: 'left' | 'right';
  frame: number;
  animationTimer: number;
  spriteSheet: HTMLImageElement | null;
}

class Player {
  state: PlayerState;
  ctx: CanvasRenderingContext2D;
  cameraOffset: { x: number; y: number };
  canvas: HTMLCanvasElement;
  spriteImg: HTMLImageElement;
  frameWidth: number = 32; // Width of each sprite frame
  frameHeight: number = 32; // Height of each sprite frame
  animationSpeed: number = 0.15; // Frames per second
  
  constructor(canvas: HTMLCanvasElement, startX: number, startY: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cameraOffset = { x: 0, y: 0 };
    
    // Setup sprite
    this.spriteImg = new Image();
    // Using a simpler asset for the sprite - we'll create this with SVG
    this.spriteImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect x="0" y="0" width="32" height="32" fill="red"/><rect x="32" y="0" width="32" height="32" fill="red"/><rect x="64" y="0" width="32" height="32" fill="red"/><rect x="96" y="0" width="32" height="32" fill="red"/></svg>`;
    
    this.state = {
      x: startX,
      y: startY,
      width: 40,
      height: 40,
      velocity: {
        x: 0,
        y: 0,
      },
      isJumping: false,
      isOnGround: false,
      direction: 'right',
      frame: 0,
      animationTimer: 0,
      spriteSheet: null
    };
    
    // Load sprite image
    this.loadSprite();
  }
  
  loadSprite() {
    const img = new Image();
    img.onload = () => {
      this.state.spriteSheet = img;
    };
    img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect x="0" y="0" width="32" height="32" fill="red"/><rect x="32" y="0" width="32" height="32" fill="red"/><rect x="64" y="0" width="32" height="32" fill="red"/><rect x="96" y="0" width="32" height="32" fill="red"/></svg>`;
  }
  
  update(deltaTime: number, controls: { left: boolean, right: boolean, jump: boolean }, gravity: number) {
    // Update physics
    const { state } = this;
    
    // Handle left/right movement
    if (controls.left) {
      state.velocity.x = -200; // Move left
      state.direction = 'left';
    } else if (controls.right) {
      state.velocity.x = 200; // Move right
      state.direction = 'right';
    } else {
      // Apply deceleration/friction
      state.velocity.x *= 0.8;
      if (Math.abs(state.velocity.x) < 0.1) state.velocity.x = 0;
    }
    
    // Handle jumping
    if (controls.jump && state.isOnGround) {
      state.velocity.y = -400; // Jump velocity
      state.isJumping = true;
      state.isOnGround = false;
    }
    
    // Apply gravity
    state.velocity.y += gravity * deltaTime;
    
    // Update position
    state.x += state.velocity.x * deltaTime;
    state.y += state.velocity.y * deltaTime;
    
    // Update animation
    if (Math.abs(state.velocity.x) > 10) {
      // Only animate when moving
      state.animationTimer += deltaTime;
      if (state.animationTimer >= this.animationSpeed) {
        state.frame = (state.frame + 1) % 4; // 4 frames in the spritesheet
        state.animationTimer = 0;
      }
    } else {
      // Reset to standing frame when not moving
      state.frame = 0;
    }
    
    // Make sure player doesn't go off-screen to the left
    if (state.x < 0) {
      state.x = 0;
      state.velocity.x = 0;
    }
  }
  
  render(cameraOffsetX: number) {
    const { state, ctx } = this;
    
    // Convert world coordinates to screen coordinates
    const screenX = state.x - cameraOffsetX;
    
    if (state.spriteSheet) {
      // Draw sprite from spritesheet
      ctx.save();
      
      if (state.direction === 'left') {
        // Flip horizontally if facing left
        ctx.scale(-1, 1);
        ctx.drawImage(
          state.spriteSheet,
          state.frame * this.frameWidth, 0, 
          this.frameWidth, this.frameHeight,
          -screenX - state.width, state.y, 
          state.width, state.height
        );
      } else {
        // Normal drawing if facing right
        ctx.drawImage(
          state.spriteSheet,
          state.frame * this.frameWidth, 0, 
          this.frameWidth, this.frameHeight,
          screenX, state.y, 
          state.width, state.height
        );
      }
      
      ctx.restore();
    } else {
      // Fallback drawing if spritesheet isn't loaded
      ctx.fillStyle = '#FF0000'; // Red
      ctx.fillRect(screenX, state.y, state.width, state.height);
    }
    
    // Draw a face on the character for better visibility
    ctx.fillStyle = 'black';
    if (state.direction === 'right') {
      // Eyes
      ctx.fillRect(screenX + state.width - 15, state.y + 10, 4, 4);
      ctx.fillRect(screenX + state.width - 25, state.y + 10, 4, 4);
      // Mouth
      ctx.fillRect(screenX + state.width - 25, state.y + 20, 14, 2);
    } else {
      // Eyes for left direction
      ctx.fillRect(screenX + 15, state.y + 10, 4, 4);
      ctx.fillRect(screenX + 25, state.y + 10, 4, 4);
      // Mouth
      ctx.fillRect(screenX + 11, state.y + 20, 14, 2);
    }
  }
  
  reset(startX: number, startY: number) {
    this.state.x = startX;
    this.state.y = startY;
    this.state.velocity.x = 0;
    this.state.velocity.y = 0;
    this.state.isJumping = false;
    this.state.isOnGround = false;
    this.state.direction = 'right';
    this.state.frame = 0;
    this.state.animationTimer = 0;
  }
}

export default Player;
